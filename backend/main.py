from http.client import HTTPException
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import os
from dotenv import load_dotenv
from huggingface_hub import login

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Code(BaseModel):
    code: str

class EventStatus(BaseModel):
    job_id: str

@app.get("/")
def read_root():
    return {"Hello": "World Bunmi Day!"}

@app.post("/train")
def train(code: Code):
    # print(code.code)
    
    # auth_token = os.getenv("AUTH_TOKEN")
    space_url = "https://bumie-e-marl-gym.hf.space/train"

    # Define the data to be sent in the request body (e.g., a JSON payload)
    payload = {
        "code": code.code
    }

    # Convert the payload to a JSON string
    json_payload = json.dumps(payload)

    try:
        # login(token=auth_token)

        headers = {
            "Content-Type": "application/json",  # Specify the content type of your data
            #"Authorization": f"token {auth_token}" # Or "Token {auth_token}", or just auth_token if it's a simple API key
        }
        response = requests.post(space_url, data=json_payload, headers=headers)
        # print(response.json())

        # response = requests.post(
        #     space_url,
        #     headers=headers,
        #     json={"code": code.code, "token": auth_token},
        #     timeout=30, # Set a timeout for the request
        # )
        response.raise_for_status() # Raise an exception for non-2xx responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Code {e}")
    return {"message": "Code received and printed."}

@app.get("/train/{job_id}/status")
def get_training_status(job_id: str):
    """
    Returns the status and metrics of a training job.
    """
    # Define the data to be sent in the request body (e.g., a JSON payload)
    space_url = f"https://bumie-e-marl-gym.hf.space/train/{job_id}/status"
    payload = {
        "job_id": job_id
    }

    # Convert the payload to a JSON string
    json_payload = json.dumps(payload)

    try:
        headers = {
            "Content-Type": "application/json",  # Specify the content type of your data
      }
        response = requests.get(space_url, data=json_payload, headers=headers)
        # print(response.json())

        response.raise_for_status() # Raise an exception for non-2xx responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Code {e}")
    return {"message": "Code received and printed."}

@app.get("/train/{job_id}/metrics")
def get_training_metrics(job_id: str):
    """
    Returns only the metrics of a training job (lightweight endpoint for polling).
    """
    # Define the data to be sent in the request body (e.g., a JSON payload)
    payload = {
        "job_id": job_id
    }
    space_url = f"https://bumie-e-marl-gym.hf.space/train/{job_id}/metrics"
    # Convert the payload to a JSON string
    json_payload = json.dumps(payload)

    try:
        headers = {
            "Content-Type": "application/json",  # Specify the content type of your data
      }
        response = requests.get(space_url, data=json_payload, headers=headers)
        # print(response.json())

        response.raise_for_status() # Raise an exception for non-2xx responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Code {e}")
    return {"message": "Code received and printed."}

@app.post("/train/{job_id}/stop")
def stop_training(job_id: str):
    """
    Stop a training job.
    """
    payload = {
        "job_id": job_id
    }
    space_url = f"https://bumie-e-marl-gym.hf.space/train/{job_id}/stop"
    # Convert the payload to a JSON string
    json_payload = json.dumps(payload)

    try:
        headers = {
            "Content-Type": "application/json",  # Specify the content type of your data
      }
        response = requests.post(space_url, data=json_payload, headers=headers)
        # print(response.json())

        response.raise_for_status() # Raise an exception for non-2xx responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Code {e}")
    return {"message": "Code received and printed."}

@app.get("/check_status")
def check_status(job_id: EventStatus):
    space_url = f"https://bumie-e-marl-gym.hf.space/train/{job_id}/status"
    try:
        headers = {
            "Content-Type": "application/json",  # Specify the content type of your data
            #"Authorization": f"token {auth_token}" # Or "Token {auth_token}", or just auth_token if it's a simple API key
        }
        response = requests.post(space_url, headers=headers)
        # print(response.json())
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Status Check Error: {e}")
    return {"status": "API is running"}