# MARL-Gym

MARL-Gym is an open-source platform where anyone can design, train, and test Reinforcement Learning (RL) agents, including multi-agent systems, with the option of custom code. This platform is an RL agent's playground where users can create custom environments using prompts, choose from already created environments, select policies, define reward functions, train, and test the agent's performance, all in one place.

## Features

- **User Authentication:** Simple email/password registration and login.
- **Environment Selection:** Choose from a variety of pre-built environments from `gymnasium` and `pettingzoo`.
- **Customization:** A web-based code editor to customize hyperparameters and reward functions.
- **Real-time Visualization:** See your agent's performance in real-time with our streaming visualization.
- **Training & Evaluation:** Train agents using popular algorithms like PPO, DQN, and A2C from `stable-baselines3`.
- **Model Management:** View your training history, export trained models, and push them to the Hugging Face Hub.
- **Community:** Share your custom environments, compete in challenges, and collaborate on projects.

## Project Milestones

### Milestone 1: The "Blind" Trainer
- Setup FastAPI backend and React frontend.
- Implement a "Start Training" button that runs PPO on CartPole-v1 in the background.

### Milestone 2: The Streaming Eye
- Implement `env.render(mode='rgb_array')` logic.
- Set up a WebSocket in FastAPI for real-time visualization.

### Milestone 3: The Customizer
- Add the Monaco Editor for code customization.
- Allow passing custom hyperparameters from the UI to the backend.

### Milestone 4: The Historian & Publisher
- Save run results to a SQLite database.
- Implement `huggingface_hub` login and push.

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- `npm`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bumie-e/MARL-Gym.git
    cd MARL-Gym
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the backend:**
    ```bash
    cd backend
    uvicorn main:app --reload
    ```

2.  **Start the frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

The backend will be running on `http://127.0.0.1:8000` and the frontend on `http://localhost:5173`.

## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  **Make your changes** and commit them with a descriptive message.
4.  **Push your changes** to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
5.  **Create a pull request** to the `main` branch of this repository.

Please make sure your code adheres to the existing style and that you've tested your changes.