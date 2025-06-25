from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime

Base = declarative_base()

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    assessments = relationship("Assessment", back_populates="team")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    participant_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    team = relationship("Team", back_populates="assessments")
    responses = relationship("Response", back_populates="assessment")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)  # psychological_safety, dependability, structure_clarity, meaning_impact
    text = Column(Text)
    order_index = Column(Integer)
    
    responses = relationship("Response", back_populates="question")

class Response(Base):
    __tablename__ = "responses"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    score = Column(Integer)  # 1-5 scale
    notes = Column(Text, nullable=True)
    
    assessment = relationship("Assessment", back_populates="responses")
    question = relationship("Question", back_populates="responses")

# Database setup
DATABASE_URL = "sqlite:///./teamhealthcheck.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()