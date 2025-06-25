from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AssessmentBase(BaseModel):
    participant_name: str

class AssessmentCreate(AssessmentBase):
    team_id: int

class ResponseCreate(BaseModel):
    question_id: int
    score: int
    notes: Optional[str] = None

class Response(BaseModel):
    id: int
    question_id: int
    score: int
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True

class Assessment(AssessmentBase):
    id: int
    team_id: int
    created_at: datetime
    responses: List[Response] = []
    
    class Config:
        from_attributes = True

class Question(BaseModel):
    id: int
    category: str
    text: str
    order_index: int
    
    class Config:
        from_attributes = True

class TeamResults(BaseModel):
    team_id: int
    team_name: str
    assessment_count: int
    psychological_safety_avg: float
    dependability_avg: float
    structure_clarity_avg: float
    meaning_impact_avg: float