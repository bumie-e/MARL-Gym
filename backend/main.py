from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import os
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from database import SessionLocal, engine
import models

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
models.Base.metadata.create_all(bind=engine)

load_dotenv()

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
HUGGINGFACE_SPACE_URL = os.getenv("HUGGINGFACE_SPACE_URL", "https://bumie-e-marl-gym.hf.space")
REQUEST_TIMEOUT = 30

def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===== PYDANTIC MODELS =====

class TrainingRequest(BaseModel):
    env_name: str = "CartPole-v1"
    total_timesteps: int = 100000
    learning_rate: float = 0.001
    n_steps: int = 2048
    batch_size: int = 64
    n_epochs: int = 10

class EventStatus(BaseModel):
    job_id: str

# ===== HELPER FUNCTIONS =====

async def forward_request(method: str, endpoint: str, data: Optional[Dict] = None, timeout: int = REQUEST_TIMEOUT):
    """
    Forward request to HuggingFace Space API with error handling
    """
    url = f"{HUGGINGFACE_SPACE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    try:
        logger.info(f"[PROXY] {method} {endpoint}")
        
        if method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=timeout)
        elif method == "GET":
            response = requests.get(url, json=data, headers=headers, timeout=timeout)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        return response.json()
    
    except requests.exceptions.Timeout:
        logger.error(f"[PROXY] Timeout connecting to {endpoint}")
        raise HTTPException(status_code=504, detail="Backend service timeout")
    except requests.exceptions.ConnectionError:
        logger.error(f"[PROXY] Connection error to {endpoint}")
        raise HTTPException(status_code=503, detail="Backend service unavailable")
    except requests.exceptions.RequestException as e:
        logger.error(f"[PROXY] Request error: {e}")
        raise HTTPException(status_code=502, detail=f"Backend error: {str(e)}")

# ===== REST ENDPOINTS =====

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "message": "RL Training API Gateway",
        "status": "running",
        "backend": HUGGINGFACE_SPACE_URL
    }

@app.post("/train")
async def start_training(request: TrainingRequest, db: Session = Depends(get_db)):
    """
    Start a new training job on the HuggingFace Space
    """
    try:
        # Prepare payload for HuggingFace Space
        payload = {
            "env_name": request.env_name,
            "total_timesteps": request.total_timesteps,
            "learning_rate": request.learning_rate,
            "n_steps": request.n_steps,
            "batch_size": request.batch_size,
            "n_epochs": request.n_epochs,
        }
        
        # Forward to HuggingFace Space
        result = await forward_request("POST", "/train", payload)
        job_id = result.get("job_id")
        
        if not job_id:
            raise HTTPException(status_code=500, detail="No job_id returned from backend")
        
        # Create training run record in database
        training_run = models.TrainingRun(
            job_id=job_id,
            environment=request.env_name,
            agent="PPO",
            episodes=0,
            reward=0.0,
            status="queued",
            metrics={},
            config={
                "env_name": request.env_name,
                "total_timesteps": request.total_timesteps,
                "learning_rate": request.learning_rate,
                "n_steps": request.n_steps,
                "batch_size": request.batch_size,
                "n_epochs": request.n_epochs,
            },
        )
        db.add(training_run)
        db.commit()
        db.refresh(training_run)
        
        logger.info(f"[TRAIN] Started job {job_id} for environment {request.env_name}")
        
        return {
            "message": "Training job started successfully!",
            "job_id": job_id,
            "status": "queued",
            "config": payload,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[TRAIN] Error starting training: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/train/{job_id}/status")
async def get_training_status(job_id: str, db: Session = Depends(get_db)):
    """
    Get full training status from backend and update database
    """
    try:
        # Forward to HuggingFace Space
        data = await forward_request("GET", f"/train/{job_id}/status")
        
        # Update database
        training_run = db.query(models.TrainingRun).filter(
            models.TrainingRun.job_id == job_id
        ).first()
        
        if training_run:
            training_run.status = data.get("status", "unknown")
            training_run.episodes = data.get("metrics", {}).get("episodes", training_run.episodes)
            training_run.reward = data.get("metrics", {}).get("mean_reward", training_run.reward)
            training_run.metrics = data.get("metrics", {})
            
            if "results" in data:
                training_run.results = data.get("results")
            
            db.commit()
            db.refresh(training_run)
        
        return data
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[STATUS] Error fetching status for job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/train/{job_id}/metrics")
async def get_training_metrics(job_id: str, db: Session = Depends(get_db)):
    """
    Lightweight endpoint for polling real-time metrics
    """
    try:
        # Forward to HuggingFace Space
        data = await forward_request("GET", f"/train/{job_id}/metrics")
        
        # Update database with latest metrics
        training_run = db.query(models.TrainingRun).filter(
            models.TrainingRun.job_id == job_id
        ).first()
        
        if training_run:
            training_run.status = data.get("status", training_run.status)
            metrics = data.get("metrics", {})
            training_run.episodes = metrics.get("episodes", training_run.episodes)
            training_run.reward = metrics.get("mean_reward", training_run.reward)
            training_run.metrics = metrics
            
            db.commit()
        
        return data
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[METRICS] Error fetching metrics for job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train/{job_id}/stop")
async def stop_training(job_id: str, db: Session = Depends(get_db)):
    """
    Stop a training job
    """
    try:
        # Forward to HuggingFace Space
        result = await forward_request("POST", f"/train/{job_id}/stop")
        
        # Update database
        training_run = db.query(models.TrainingRun).filter(
            models.TrainingRun.job_id == job_id
        ).first()
        
        if training_run:
            training_run.status = "stopped"
            db.commit()
        
        logger.info(f"[STOP] Stopped job {job_id}")
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[STOP] Error stopping job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== TRAINING HISTORY ENDPOINTS =====

@app.get("/api/training-history")
async def get_training_history(limit: int = 100, db: Session = Depends(get_db)):
    """Get all training runs with optional pagination"""
    try:
        runs = db.query(models.TrainingRun).order_by(
            models.TrainingRun.created_at.desc()
        ).limit(limit).all()
        
        return [
            {
                "id": run.id,
                "job_id": run.job_id,
                "environment": run.environment,
                "agent": run.agent,
                "episodes": run.episodes,
                "status": run.status,
                "reward": run.reward,
                "created_at": run.created_at.isoformat(),
                "metrics": run.metrics,
                "config": run.config,
                "results": run.results,
            }
            for run in runs
        ]
    except Exception as e:
        logger.error(f"[HISTORY] Error fetching training history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/training-history/latest")
async def get_latest_training_history(limit: int = 5, db: Session = Depends(get_db)):
    """Get the latest N training runs"""
    try:
        runs = db.query(models.TrainingRun).order_by(
            models.TrainingRun.created_at.desc()
        ).limit(limit).all()
        
        return [
            {
                "id": run.id,
                "job_id": run.job_id,
                "environment": run.environment,
                "agent": run.agent,
                "episodes": run.episodes,
                "status": run.status,
                "reward": run.reward,
                "created_at": run.created_at.isoformat(),
                "metrics": run.metrics,
                "config": run.config,
                "results": run.results,
            }
            for run in runs
        ]
    except Exception as e:
        logger.error(f"[HISTORY] Error fetching latest training history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/training-history/{run_id}")
async def get_training_run(run_id: int, db: Session = Depends(get_db)):
    """Get a specific training run by ID"""
    try:
        run = db.query(models.TrainingRun).filter(
            models.TrainingRun.id == run_id
        ).first()
        
        if not run:
            raise HTTPException(status_code=404, detail=f"Training run {run_id} not found")
        
        return {
            "id": run.id,
            "job_id": run.job_id,
            "environment": run.environment,
            "agent": run.agent,
            "episodes": run.episodes,
            "status": run.status,
            "reward": run.reward,
            "created_at": run.created_at.isoformat(),
            "metrics": run.metrics,
            "config": run.config,
            "results": run.results,
        }
    except Exception as e:
        logger.error(f"[HISTORY] Error fetching training run {run_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/training-history/job/{job_id}")
async def get_training_run_by_job_id(job_id: str, db: Session = Depends(get_db)):
    """Get a specific training run by job_id"""
    try:
        run = db.query(models.TrainingRun).filter(
            models.TrainingRun.job_id == job_id
        ).first()
        
        if not run:
            raise HTTPException(status_code=404, detail=f"Training run with job_id {job_id} not found")
        
        return {
            "id": run.id,
            "job_id": run.job_id,
            "environment": run.environment,
            "agent": run.agent,
            "episodes": run.episodes,
            "status": run.status,
            "reward": run.reward,
            "created_at": run.created_at.isoformat(),
            "metrics": run.metrics,
            "config": run.config,
            "results": run.results,
        }
    except Exception as e:
        logger.error(f"[HISTORY] Error fetching training run by job_id: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/training-history/{run_id}")
async def delete_training_run(run_id: int, db: Session = Depends(get_db)):
    """Delete a training run from history"""
    try:
        run = db.query(models.TrainingRun).filter(
            models.TrainingRun.id == run_id
        ).first()
        
        if not run:
            raise HTTPException(status_code=404, detail=f"Training run {run_id} not found")
        
        db.delete(run)
        db.commit()
        
        logger.info(f"[HISTORY] Deleted training run {run_id}")
        return {"message": f"Training run {run_id} deleted successfully"}
    except Exception as e:
        logger.error(f"[HISTORY] Error deleting training run {run_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/debug/jobs")
async def debug_jobs(db: Session = Depends(get_db)):
    """Debug endpoint to list all training jobs"""
    try:
        runs = db.query(models.TrainingRun).order_by(
            models.TrainingRun.created_at.desc()
        ).limit(20).all()
        
        return {
            "total": db.query(models.TrainingRun).count(),
            "recent": [
                {
                    "job_id": run.job_id,
                    "status": run.status,
                    "environment": run.environment,
                    "episodes": run.episodes,
                    "reward": round(run.reward, 2),
                    "created_at": run.created_at.isoformat(),
                }
                for run in runs
            ]
        }
    except Exception as e:
        logger.error(f"[DEBUG] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))