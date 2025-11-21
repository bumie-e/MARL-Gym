from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import os
import uuid
from typing import Dict, Any

app = FastAPI()

# In-memory storage for training jobs
training_jobs: Dict[str, Dict[str, Any]] = {}

# Define the request body for the training job
class TrainingJob(BaseModel):
    code: str

# This is where you'll put your training logic
def run_training(job_id: str, user_code: str):
    """
    This function runs the user's code and updates the job status.
    """
    print(f"--- Starting Training for job {job_id} ---")
    training_jobs[job_id]["status"] = "training"
    try:
        # Create a dictionary to serve as the local namespace for exec
        local_namespace = {}
        
        # Execute the user's code
        exec(user_code, {}, local_namespace)
        
        # Assume the user's code stores results in a 'results' dictionary
        results = local_namespace.get('results', {})
        
        # Store the results and mark the job as completed
        training_jobs[job_id]["status"] = "completed"
        training_jobs[job_id]["results"] = results
        print(f"--- Training for job {job_id} Finished ---")
        
    except Exception as e:
       # Mark the job as failed and store the error message
       training_jobs[job_id]["status"] = "failed"
       training_jobs[job_id]["error"] = str(e)
       print(f"--- Training for job {job_id} Failed: {e} ---")

@app.get('/')
def read_root():
    return {"message": "Welcome to the Training API!"}

@app.post("/train")
def start_training(job: TrainingJob, background_tasks: BackgroundTasks):
    
    # Generate a unique job ID
    job_id = str(uuid.uuid4())
    
    # Initialize the job in our in-memory storage
    training_jobs[job_id] = {"status": "queued"}

    # Start the training in the background
    background_tasks.add_task(run_training, job_id, job.code)

    return {"message": "Training job started successfully!", "job_id": job_id}

@app.get("/train/{job_id}/status")
def get_training_status(job_id: str):
    """
    Returns the status and results of a training job.
    """
    job = training_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
