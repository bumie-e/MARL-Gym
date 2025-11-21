export const gridworld = {
  id: 'gridworld',
  name: 'GridWorld',
  description: 'A simple grid world environment.',
  color: 'from-purple-500 to-pink-500',
  icon: '🎯',
  actionSpace: 'Discrete(4)',
  observationSpace: 'Discrete(16)',
  details: {
    description: 'Navigate through a grid to reach a goal position while avoiding obstacles.',
    actions: [
      { value: 0, description: 'Move up' },
      { value: 1, description: 'Move right' },
      { value: 2, description: 'Move down' },
      { value: 3, description: 'Move left' }
    ],
    observations: [
      { index: 0, name: 'Grid Position', min: '0', max: '15' }
    ],
    reward: '+1 for reaching goal, -1 for obstacles, -0.01 per step',
    termination: ['Reaching the goal', 'Maximum steps exceeded']
  },
  defaultCode: `import gymnasium as gym
from stable_baselines3 import DQN

# Create GridWorld environment
env = gym.make('GridWorld-v0')

# Initialize DQN agent
model = DQN('MlpPolicy', env, verbose=1)

# Train
model.learn(total_timesteps=50000)
model.save("gridworld_dqn")`
};