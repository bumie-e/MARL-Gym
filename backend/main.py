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

@app.get("/")
def read_root():
    return {"Hello": "World Bunmi Day!"}

@app.post("/train")
def train(code: Code):
    # print(code.code)
    space_url = "https://bumie-e-marl-gym.hf.space/train"
    auth_token = os.getenv("AUTH_TOKEN")

    # Define the data to be sent in the request body (e.g., a JSON payload)
    payload = {
        "code": code.code
    }

    # Convert the payload to a JSON string
    json_payload = json.dumps(payload)

    try:
        login(token=auth_token)

        headers = {
            "Content-Type": "application/json",  # Specify the content type of your data
            #"Authorization": f"token {auth_token}" # Or "Token {auth_token}", or just auth_token if it's a simple API key
        }
        response = requests.post(space_url, data=json_payload, headers=headers)
        print(response)

        # response = requests.post(
        #     space_url,
        #     headers=headers,
        #     json={"code": code.code, "token": auth_token},
        #     timeout=30, # Set a timeout for the request
        # )
        response.raise_for_status() # Raise an exception for non-2xx responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(e)
    return {"message": "Code received and printed."}

