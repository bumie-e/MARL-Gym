I want to build an open source platform where anyone can design, train, and test RL agents, and RL multi agents, even with the option of custom code.  This platform is n RL agents playground where users can create custom environments using prompts, choose from already created environments, select polices, define reward functions, train, and test the agent performance, all on one place. It is going to be an online platform.

For compute, I'm looking at integrating/training the models on external APIs like Google Colab, Hugging face, modal labs.

This is a rough idea of what I'd like to implement as an MVP

- User creates an account/logs in
- User sees a home page, informing him to test out training with already built environment
- User selects grid world, adds the training parameters, optionally customises the code in a side code editor, and start the training. 
- However, the user needs to visualise the environment before training, and the agent while training. Perhaps continuous rendering the gym environments and Petting zoo for multi agent systems
- At the end of training, user can evaluate  the agent, write custom evaluation, export the results, and see history of previous trainings.
- User also has option of hosting the model to hugging face

For this project, the Gymnasium and Petting zoo libraries would be used for environments, and RLlib, Stable Baselines3, or custom code for the RL algorithms.

The platform would also include a community section where users can share their custom environments, compete (agents completeing taks within a given time with specific rewards) together on challenges, policies, and reward functions, as well as collaborate on projects.
