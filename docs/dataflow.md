The Data Flow:

Browser opens WebSocket connection to /ws/training/{job_id}.

Backend starts the RL loop.

Inside the Loop (Step callback):

Get obs, reward -> Store in DB.

Call env.render() -> Get Numpy Array.

Compress Array to JPEG -> Send over WebSocket.

Browser receives message:

If type metric: Update Chart.js graph.

If type frame: Update <img src="data:image/jpeg;base64,..." />.