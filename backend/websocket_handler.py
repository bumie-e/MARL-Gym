from fastapi import WebSocket
import asyncio
import base64
import cv2
import numpy as np
from collections import deque

# Store active connections and their rendering state
active_renders = {}

class RenderManager:
    def __init__(self, job_id: str):
        self.job_id = job_id
        self.frame_queue = deque(maxlen=1)  # Keep only latest frame
        self.is_recording = False
        self.env = None
    
    def add_frame(self, frame: np.ndarray):
        """Add a frame to the queue"""
        if frame is not None:
            self.frame_queue.append(frame)
    
    def get_latest_frame(self) -> np.ndarray:
        """Get the latest frame"""
        if self.frame_queue:
            return self.frame_queue[-1]
        return None