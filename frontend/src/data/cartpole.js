export const cartpole = {
  id: 'cartpole',
  name: 'CartPole',
  description: 'Balancing a pole on a cart.',
  color: 'from-blue-500 to-cyan-500',
  icon: '⚖️',
  actionSpace: 'Discrete(2)',
  observationSpace: 'Box(4,)',
  details: {
    description: 'A pole is attached by an un-actuated joint to a cart, which moves along a frictionless track. The pendulum is placed upright on the cart and the goal is to balance the pole by applying forces in the left and right direction on the cart.',
    actions: [
      { value: 0, description: 'Push cart to the left' },
      { value: 1, description: 'Push cart to the right' }
    ],
    observations: [
      { index: 0, name: 'Cart Position', min: '-4.8', max: '4.8' },
      { index: 1, name: 'Cart Velocity', min: '-Inf', max: 'Inf' },
      { index: 2, name: 'Pole Angle', min: '~-0.418 rad (-24°)', max: '~0.418 rad (24°)' },
      { index: 3, name: 'Pole Angular Velocity', min: '-Inf', max: 'Inf' }
    ],
    reward: 'A reward of +1 is given for every step taken, including the termination step.',
    termination: [
      'Pole Angle is greater than ±12°',
      'Cart Position is greater than ±2.4',
      'Episode length is greater than 500'
    ]
  },
  defaultCode: `import gymnasium as gym
import numpy as np
from stable_baselines3.common.evaluation import evaluate_policy 
from stable_baselines3.common.monitor import Monitor
from stable_baselines3 import PPO

# Create the CartPole environment and wrap it with a Monitor 
env = gym.make('CartPole-v1')
env = Monitor(env)

# Initialize the PPO agent
model = PPO('MlpPolicy', env, verbose=1,
            learning_rate=0.001,
            n_steps=2048,
            batch_size=64,
            n_epochs=10)

# Train the agent
model.learn(total_timesteps=100000)

# Evaluate the trained agent
mean_reward, std_reward = evaluate_policy(model, env, n_eval_episodes=100)  

# Save the model
model.save("cartpole_ppo")

print("Training completed!")
# Prepare the results dictionary 
results = {
  "mean_reward": mean_reward,
  "std_reward": std_reward,
  "model_path": "cartpole_ppo.zip" 
} 
print(f"Mean reward: {mean_reward:.2f} +/- {std_reward:.2f}")
`


};