from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class TrainingRun(Base):
    __tablename__ = "training_runs"

    # Primary identifier
    id = Column(Integer, primary_key=True, index=True)
    
    # Job tracking
    job_id = Column(String, unique=True, index=True)
    
    # Environment and agent info
    environment = Column(String, default="unknown")
    agent = Column(String, default="PPO")
    
    # Training metrics
    episodes = Column(Integer, default=0)
    reward = Column(Float, default=0.0)
    status = Column(String, default="queued")  # queued, training, completed, failed, stopped
    
    # Store full configuration and results as JSON
    config = Column(JSON, default={})
    metrics = Column(JSON, default={})
    results = Column(JSON, default={})
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<TrainingRun(id={self.id}, job_id={self.job_id}, environment={self.environment}, status={self.status})>"