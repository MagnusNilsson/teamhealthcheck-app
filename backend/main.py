from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import models
import schemas
from models import get_db, create_tables

app = FastAPI(title="Team Health Check API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
def startup_event():
    create_tables()

# Teams endpoints
@app.post("/teams/", response_model=schemas.Team)
def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    db_team = models.Team(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@app.get("/teams/", response_model=List[schemas.Team])
def get_teams(db: Session = Depends(get_db)):
    return db.query(models.Team).all()

@app.get("/teams/{team_id}", response_model=schemas.Team)
def get_team(team_id: int, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

# Questions endpoints
@app.get("/questions/", response_model=List[schemas.Question])
def get_questions(db: Session = Depends(get_db)):
    return db.query(models.Question).order_by(models.Question.category, models.Question.order_index).all()

@app.get("/questions/{category}", response_model=List[schemas.Question])
def get_questions_by_category(category: str, db: Session = Depends(get_db)):
    return db.query(models.Question).filter(models.Question.category == category).order_by(models.Question.order_index).all()

# Assessments endpoints
@app.post("/assessments/", response_model=schemas.Assessment)
def create_assessment(assessment: schemas.AssessmentCreate, db: Session = Depends(get_db)):
    # Check if team exists
    team = db.query(models.Team).filter(models.Team.id == assessment.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    db_assessment = models.Assessment(**assessment.dict())
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    return db_assessment

@app.get("/assessments/team/{team_id}", response_model=List[schemas.Assessment])
def get_team_assessments(team_id: int, db: Session = Depends(get_db)):
    return db.query(models.Assessment).filter(models.Assessment.team_id == team_id).all()

# Responses endpoints
@app.post("/assessments/{assessment_id}/responses/")
def create_responses(assessment_id: int, responses: List[schemas.ResponseCreate], db: Session = Depends(get_db)):
    # Check if assessment exists
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    db_responses = []
    for response in responses:
        db_response = models.Response(
            assessment_id=assessment_id,
            **response.dict()
        )
        db.add(db_response)
        db_responses.append(db_response)
    
    db.commit()
    return {"message": f"Created {len(db_responses)} responses"}

@app.get("/assessments/{assessment_id}/responses/", response_model=List[schemas.Response])
def get_assessment_responses(assessment_id: int, db: Session = Depends(get_db)):
    return db.query(models.Response).filter(models.Response.assessment_id == assessment_id).all()

# Results endpoints
@app.get("/teams/{team_id}/results/", response_model=schemas.TeamResults)
def get_team_results(team_id: int, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Get assessment count
    assessment_count = db.query(models.Assessment).filter(models.Assessment.team_id == team_id).count()
    
    if assessment_count == 0:
        return schemas.TeamResults(
            team_id=team_id,
            team_name=team.name,
            assessment_count=0,
            psychological_safety_avg=0.0,
            dependability_avg=0.0,
            structure_clarity_avg=0.0,
            meaning_impact_avg=0.0
        )
    
    # Calculate averages by category
    def get_category_average(category: str) -> float:
        result = db.query(func.avg(models.Response.score))\
            .join(models.Question)\
            .join(models.Assessment)\
            .filter(models.Assessment.team_id == team_id)\
            .filter(models.Question.category == category)\
            .scalar()
        return round(float(result) if result else 0.0, 2)
    
    return schemas.TeamResults(
        team_id=team_id,
        team_name=team.name,
        assessment_count=assessment_count,
        psychological_safety_avg=get_category_average("psychological_safety"),
        dependability_avg=get_category_average("dependability"),
        structure_clarity_avg=get_category_average("structure_clarity"),
        meaning_impact_avg=get_category_average("meaning_impact")
    )

@app.get("/")
def root():
    return {"message": "Team Health Check API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)