# Project Issues

This file tracks the development of the MARL-Gym project.

## Milestone 1: The "Blind" Trainer

- [ ] **Issue #1: Basic Project Setup**
  - Description: Set up the initial project structure with a FastAPI backend and a React frontend.
  - Tasks:
    - [ ] Initialize a FastAPI application.
    - [ ] Create a basic React app.
    - [ ] Establish a simple communication channel between frontend and backend.

- [ ] **Issue #2: "Start Training" MVP**
  - Description: Implement the core functionality to start a training job in the background without visualization.
  - Tasks:
    - [ ] Create a "Start Training" button in the React frontend.
    - [ ] Set up an API endpoint in FastAPI to receive the training request.
    - [ ] Run a simple RL training loop (e.g., PPO on CartPole-v1) as a background task.
    - [ ] Return a "Training Complete" message to the frontend upon completion.

## Milestone 2: The Streaming Eye

- [ ] **Issue #3: Environment Rendering Backend**
  - Description: Implement the logic to render the RL environment on the backend.
  - Tasks:
    - [ ] Use `env.render(mode='rgb_array')` to get the environment as a NumPy array.
    - [ ] Convert the NumPy array to a JPEG or PNG image.

- [ ] **Issue #4: Real-time Visualization with WebSockets**
  - Description: Stream the rendered environment from the backend to the frontend for real-time visualization.
  - Tasks:
    - [ ] Set up a WebSocket endpoint in FastAPI.
    - [ ] Establish a WebSocket connection from the React frontend.
    - [ ] Stream the rendered frames over the WebSocket.
    - [ ] Display the received frames in the frontend.

## Milestone 3: The Customizer

- [ ] **Issue #5: Code Editor Integration**
  - Description: Integrate the Monaco Editor into the React frontend for code customization.
  - Tasks:
    - [ ] Add the `@monaco-editor/react` component to the frontend.
    - [ ] Display a default reward function or hyperparameter configuration in the editor.

- [ ] **Issue #6: Custom Hyperparameters**
  - Description: Allow users to pass custom hyperparameters from the UI to the backend.
  - Tasks:
    - [ ] Create a form in the frontend to input hyperparameters (e.g., learning rate).
    - [ ] Send the custom hyperparameters to the backend when starting a training job.
    - [ ] Use the provided hyperparameters in the RL training loop.

## Milestone 4: The Historian & Publisher

- [ ] **Issue #7: Training History**
  - Description: Save the results of each training run to a database.
  - Tasks:
    - [ ] Set up a SQLite database.
    - [ ] Create a table to store training history (e.g., hyperparameters, metrics, model path).
    - [ ] Save the results of each training run to the database.
    - [ ] Create an API endpoint to retrieve the training history.
    - [ ] Display the training history in the frontend.

- [ ] **Issue #8: Hugging Face Integration**
  - Description: Allow users to push their trained models to the Hugging Face Hub.
  - Tasks:
    - [ ] Implement a login mechanism for Hugging Face.
    - [ ] Use the `huggingface_hub` library to push models to the Hub.
    - [ ] Add a "Push to Hub" button in the frontend.

## Additional Features

- [ ] **Issue #9: User Authentication**
  - Description: Implement a user authentication system.
  - Tasks:
    - [ ] Simple email/password registration.
    - [ ] Login/logout functionality.
    - [ ] Session management.
    - [ ] Basic user profile.

- [ ] **Issue #10: Multi-agent Support**
  - Description: Add support for multi-agent RL environments using PettingZoo.
  - Tasks:
    - [ ] Integrate `pettingzoo` environments.
    - [ ] Adapt the visualization to support multiple agents.
    - [ ] Allow selection of multi-agent algorithms.

- [ ] **Issue #11: Community Features**
  - Description: Implement a community section for sharing and collaboration.
  - Tasks:
    - [ ] Allow users to share custom environments.
    - [ ] Create challenges and leaderboards.
    - [ ] Enable collaboration on projects.
