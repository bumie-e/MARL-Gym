import { useState } from 'react';

// Import the three main pages
import Dashboard from './pages/Dashboard';
import PlaygroundPage from './pages/PlaygroundPage';
import TrainingPage from './pages/TrainingPage';

// Import all environment data (cartpole, gridworld, etc.)
import { environments } from './data/environments';

function App() {
  // ===== STATE MANAGEMENT =====
  // Track which page we're on: 'dashboard', 'playground', or 'training'
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Store the environment the user selected (null when on dashboard)
  const [selectedEnv, setSelectedEnv] = useState(null);
  
  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  
  // Store the training code (editable by user)
  const [code, setCode] = useState('');

  // ===== EVENT HANDLERS =====
  
  // When user clicks on an environment card
  const handleEnvClick = (env) => {
    setSelectedEnv(env);  // Save which environment was clicked
    setCode(env.defaultCode);  // Load the default training code for that environment
    setCurrentPage('playground');  // Navigate to playground page
  };

  // When user clicks "Start Training" button
  const startTraining = () => {
    fetch("http://127.0.0.1:8000/train", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setCurrentPage('training');  // Navigate to training page
        setIsTraining(true);
        setTrainingProgress(0);
        setCurrentEpisode(0);
        
        // Simulate training progress (in real app, this would connect to backend)
        const interval = setInterval(() => {
          setTrainingProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsTraining(false);
              return 100;
            }
            return prev + 1;
          });
          setCurrentEpisode(prev => prev + 1);
        }, 100);
      })
      .catch(error => {
        console.error("There was an error with the fetch operation:", error);
      });
  };

  // Generate fake metrics for demonstration (in real app, comes from training process)
  const generateMetrics = () => {
    const episodes = Array.from({length: 20}, (_, i) => i + 1);
    return {
      meanReward: episodes.map(e => Math.random() * 500),
      loss: episodes.map(e => Math.max(0, 1 - e * 0.05 + Math.random() * 0.1))
    };
  };

  const metrics = generateMetrics();

  // ===== PAGE ROUTING =====
  // Decide which page to show based on currentPage state
  
  // Show Playground Page if user selected an environment
  if (currentPage === 'playground' && selectedEnv) {
    return (
      <PlaygroundPage 
        env={selectedEnv}  // Pass the selected environment data
        code={code}  // Pass the training code
        setCode={setCode}  // Allow user to edit code
        onBack={() => setCurrentPage('dashboard')}  // Back button returns to dashboard
        onStartTraining={startTraining}  // Start Training button handler
      />
    );
  }

  // Show Training Page if training started
  if (currentPage === 'training' && selectedEnv) {
    return (
      <TrainingPage 
        env={selectedEnv}  // Pass environment data
        code={code}  // Pass the training code
        isTraining={isTraining}  // Is training currently running?
        progress={trainingProgress}  // Progress percentage (0-100)
        episode={currentEpisode}  // Current episode number
        metrics={metrics}  // Training metrics (reward, loss)
        onBack={() => setCurrentPage('playground')}  // Back button
        onStop={() => {  // Stop button handler
          setIsTraining(false);
          setCurrentPage('playground');
        }}
      />
    );
  }

  // Default: Show Dashboard
  return (
    <Dashboard 
      environments={environments}  // Pass all environment data from data/environments.js
      onEnvClick={handleEnvClick}  // Handler for when user clicks an environment card
    />
  );
}

export default App;