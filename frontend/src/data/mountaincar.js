export const mountaincar = {
  id: 'mountaincar',
  name: 'MountainCar',
  description: 'Driving a car up a mountain.',
  color: 'from-green-500 to-emerald-500',
  icon: '🚗',
  actionSpace: 'Discrete(3)',
  observationSpace: 'Box(2,)',
  details: {
    description: 'A car is on a one-dimensional track, positioned between two mountains. The goal is to drive up the mountain on the right.',
    actions: [
      { value: 0, description: 'Accelerate to the left' },
      { value: 1, description: "Don't accelerate" },
      { value: 2, description: 'Accelerate to the right' }
    ],
    observations: [
      { index: 0, name: 'Car Position', min: '-1.2', max: '0.6' },
      { index: 1, name: 'Car Velocity', min: '-0.07', max: '0.07' }
    ],
    reward: '-1 for each step until the car reaches the goal',
    termination: ['Reaching the goal position', 'Maximum steps (200) exceeded']
  },
  defaultCode: `import gymnasium as gym
from stable_baselines3 import A2C

# Create MountainCar environment
env = gym.make('MountainCar-v0')

# Initialize A2C agent
model = A2C('MlpPolicy', env, verbose=1)

# Train
model.learn(total_timesteps=100000)
model.save("mountaincar_a2c")`
};