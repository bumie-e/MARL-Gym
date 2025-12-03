import { useState, useEffect, useRef } from 'react';

// Import the main pages
import Dashboard from './pages/Dashboard';
import PlaygroundPage from './pages/PlaygroundPage';
import TrainingPage from './pages/TrainingPage';
import HistoryPage from './pages/HistoryPage';

// Import all environment data
import { environments } from './data/environments';

function App() {
  // ===== STATE MANAGEMENT =====
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedEnv, setSelectedEnv] = useState(null);
  
  // Training state
  const [jobId, setJobId] = useState(null);
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [trainingResults, setTrainingResults] = useState(null);
  const [trainingError, setTrainingError] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  
  // Real-time metrics from backend
  const [metrics, setMetrics] = useState({
    timesteps: 0,
    episodes: 0,
    progress: 0,
    episode_rewards: [],
    episode_lengths: [],
    current_episode_reward: 0,
    mean_reward: 0,
    std_reward: 0,
    eval_mean_reward: null,
    eval_std_reward: null,
    logs: [],
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Store the training code
  const [code, setCode] = useState('');
  const [trainingConfig, setTrainingConfig] = useState({
    env_name: 'CartPole-v1',
    total_timesteps: 100000,
    learning_rate: 0.001,
    n_steps: 2048,
    batch_size: 64,
    n_epochs: 10,
  });

  const pollInterval = useRef(null);

  // ===== POLLING LOGIC for training status and metrics =====
  useEffect(() => {
    if (!jobId) {
      return;
    }

    const pollMetrics = () => {
      fetch(`http://127.0.0.1:8000/train/${jobId}/metrics`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Metrics received:', data);
          setTrainingStatus(data.status);
          setMetrics(data.metrics);
          setElapsedTime(data.elapsed_time);
          setTrainingProgress(data.metrics.progress);
          setCurrentEpisode(data.metrics.episodes);

          // Stop polling when training is done
          if (data.status === 'completed' || data.status === 'failed' || data.status === 'stopped') {
            clearInterval(pollInterval.current);
            
            // Fetch final results
            if (data.status === 'completed') {
              fetch(`http://127.0.0.1:8000/train/${jobId}/status`)
                .then((res) => res.json())
                .then((statusData) => {
                  setTrainingResults(statusData.results);
                  setIsTraining(false);
                })
                .catch((error) => console.error('Error fetching final status:', error));
            } else {
              setIsTraining(false);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching metrics:', error);
        });
    };

    // Poll immediately on first load
    pollMetrics();

    // Then poll every 2 seconds
    pollInterval.current = setInterval(pollMetrics, 2000);

    return () => {
      clearInterval(pollInterval.current);
    };
  }, [jobId]);

  // ===== EVENT HANDLERS =====
  
  const handleEnvClick = (env) => {
    setSelectedEnv(env);
    setCode(env.defaultCode || '');
    setCurrentPage('playground');
  };

  const handleNavClick = (page) => {
    console.log('Navigation clicked:', page);
    setCurrentPage(page);
  };

  const startTraining = (config) => {
    console.log('Starting training with config:', config);
    
    setTrainingResults(null);
    setTrainingError(null);
    setMetrics({
      timesteps: 0,
      episodes: 0,
      progress: 0,
      episode_rewards: [],
      episode_lengths: [],
      current_episode_reward: 0,
      mean_reward: 0,
      std_reward: 0,
      eval_mean_reward: null,
      eval_std_reward: null,
      logs: [],
    });

    const trainingPayload = {
      code: code,
      ...config,
    };

    console.log('Sending payload:', trainingPayload);

    fetch('http://127.0.0.1:8000/train', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingPayload),
    })
      .then((res) => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Training started:', data);
        setJobId(data.job_id);
        setTrainingStatus('queued');
        setTrainingConfig(config);
        setCurrentPage('training');
        setIsTraining(true);
      })
      .catch((error) => {
        console.error('Error starting training:', error);
        setTrainingError('Failed to start training: ' + error.message);
      });
  };

  const handleStopTraining = () => {
    if (jobId) {
      fetch(`http://127.0.0.1:8000/train/${jobId}/stop`, {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.message);
          clearInterval(pollInterval.current);
          setJobId(null);
          setTrainingStatus('stopped');
          setIsTraining(false);
        })
        .catch((error) => {
          console.error('Error stopping training:', error);
        });
    }
  };

  // ===== PAGE ROUTING =====

  if (currentPage === 'playground' && selectedEnv) {
    return (
      <PlaygroundPage 
        env={selectedEnv}
        code={code}
        setCode={setCode}
        onBack={() => setCurrentPage('dashboard')}
        onStartTraining={startTraining}
      />
    );
  }

  // In your App.jsx, find this section and update it:

  if (currentPage === 'training' && selectedEnv) {
    return (
      <TrainingPage 
        jobId={jobId}                    /* ← Pass the jobId state */
        env={selectedEnv}
        code={code}
        isTraining={isTraining}
        progress={trainingProgress}
        episode={currentEpisode}
        status={trainingStatus}
        results={trainingResults}
        error={trainingError}
        metrics={metrics}
        elapsedTime={elapsedTime}
        onBack={() => setCurrentPage('playground')}
        onStop={() => {
          handleStopTraining();
          // setCurrentPage('playground');
        }}
      />
    );
  }


  if (currentPage === 'history') {
    return (
      <HistoryPage 
        onBack={() => setCurrentPage('dashboard')}
        onSelectRun={(run) => {
          console.log('Selected run:', run);
          // You can navigate to a detail view if needed
        }}
      />
    );
  }

  // Default: Show Dashboard
  return (
    <Dashboard 
      environments={environments}
      onEnvClick={handleEnvClick}
      onNavClick={handleNavClick}
      activeTab={currentPage}
      setActiveTab={setCurrentPage}
    />
  );
}

export default App;