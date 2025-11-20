Milestone 1: The "Blind" Trainer

Setup FastAPI backend and React frontend.

Implement "Start Training" button that runs PPO on CartPole-v1 in the background (no visualization yet).

Success Criteria: You click the button, wait 10 seconds, and get a "Training Complete" message.

Milestone 2: The Streaming Eye

Implement the env.render(mode='rgb_array') logic.

Set up the WebSocket in FastAPI.

Success Criteria: You can see a grainy, slightly delayed video of the CartPole balancing in your browser.

Milestone 3: The Customizer

Add the Monaco Editor.

Allow passing custom hyperparameters from UI to Python.

Success Criteria: You change the Learning Rate to 0.0001 in UI, and the training (and graphs) visibly slow down.

Milestone 4: The Historian & Publisher

Save run results to SQLite.

Implement huggingface_hub login and push.

Success Criteria: You can click a button and see your model appear on your actual Hugging Face profile.