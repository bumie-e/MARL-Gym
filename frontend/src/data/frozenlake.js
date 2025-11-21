export const frozenlake = {
  id: 'frozenlake',
  name: 'FrozenLake',
  description: 'Navigating a frozen lake.',
  color: 'from-indigo-500 to-purple-500',
  icon: '❄️',
  actionSpace: 'Discrete(4)',
  observationSpace: 'Discrete(16)',
  details: {
    description: 'Navigate a frozen lake from start to goal without falling into holes.',
    actions: [
      { value: 0, description: 'Move left' },
      { value: 1, description: 'Move down' },
      { value: 2, description: 'Move right' },
      { value: 3, description: 'Move up' }
    ],
    observations: [
      { index: 0, name: 'Current Position', min: '0', max: '15' }
    ],
    reward: '+1 for reaching goal, 0 otherwise',
    termination: ['Reaching the goal', 'Falling into a hole', 'Maximum steps exceeded']
  },
  defaultCode: `import gymnasium as gym
from stable_baselines3 import PPO

# Create FrozenLake environment
env = gym.make('FrozenLake-v1')

# Initialize PPO agent
model = PPO('MlpPolicy', env, verbose=1)

# Train
model.learn(total_timesteps=100000)
model.save("frozenlake_ppo")`
};