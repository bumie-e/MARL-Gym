import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HistoryPage({ onBack, onSelectRun }) {
  const [history, setHistory] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all training history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching training history...');
        const response = await fetch('http://127.0.0.1:8000/api/training-history?limit=100');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('History data received:', data);
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching history:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Update chart when a run is selected
  useEffect(() => {
    if (selectedRun?.metrics?.episode_rewards) {
      const newData = selectedRun.metrics.episode_rewards.map((reward, idx) => ({
        episode: idx + 1,
        reward: reward,
        avgReward: selectedRun.metrics.mean_reward || reward,
      }));
      setChartData(newData);
    }
  }, [selectedRun]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 'failed':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
      case 'stopped':
        return 'bg-gradient-to-r from-gray-400 to-slate-500 text-white';
      default:
        return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">Error loading history: {error}</p>
          <button 
            onClick={onBack}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Left Sidebar - History List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-700 hover:text-indigo-600 transition mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Training History</h2>
          <p className="text-gray-600 text-sm mt-1">{history.length} total runs</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {history.length > 0 ? (
            history.map((run) => (
              <button
                key={run.id}
                onClick={() => setSelectedRun(run)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedRun?.id === run.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-gray-800">{run.environment}</div>
                  <span className={`px-2 py-1 text-xs leading-4 font-bold rounded ${
                    getStatusBadge(run.status)
                  }`}>
                    {run.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono mb-2">
                  {run.job_id ? run.job_id.substring(0, 12) + '...' : `Run #${run.id}`}
                </div>
                <div className="text-sm text-gray-700">
                  Episodes: <span className="font-bold">{run.metrics.episodes}</span>
                </div>
                <div className="text-sm text-gray-700">
                  Reward: <span className="font-bold">{run.results?.mean_reward?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(run.created_at).toLocaleDateString()}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No training history yet
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Run Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedRun ? (
          <>
            {/* Top Bar */}
            <div className="bg-white/70 backdrop-blur-md shadow-lg border-b border-white/50 p-6">
                              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {selectedRun.environment}
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Run ID: <span className="font-mono">{selectedRun.job_id || `#${selectedRun.id}`}</span>
                  </p>
                </div>
                <span className={`px-4 py-2 text-lg leading-6 font-bold rounded-lg ${
                  getStatusBadge(selectedRun.status)
                }`}>
                  {selectedRun.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Configuration */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Configuration</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Environment</p>
                      <p className="text-lg font-bold text-gray-800">{selectedRun.config.env_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Timesteps</p>
                      <p className="text-lg font-bold text-gray-800">{selectedRun.config.total_timesteps.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Learning Rate</p>
                      <p className="text-lg font-bold text-gray-800">{selectedRun.config.learning_rate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Batch Size</p>
                      <p className="text-lg font-bold text-gray-800">{selectedRun.config.batch_size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">N Steps</p>
                      <p className="text-lg font-bold text-gray-800">{selectedRun.config.n_steps}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">N Epochs</p>
                      <p className="text-lg font-bold text-gray-800">{selectedRun.config.n_epochs}</p>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Mean Reward</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedRun.results?.mean_reward?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Std Reward</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedRun.results?.std_reward?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Episodes</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedRun.metrics.episodes}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Timesteps</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {(selectedRun.metrics.timesteps || selectedRun.config.total_timesteps).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reward Chart */}
                {chartData.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Episode Rewards</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="episode" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }} />
                        <Legend />
                        <Line type="monotone" dataKey="reward" stroke="#6366f1" dot={false} name="Episode Reward" />
                        <Line type="monotone" dataKey="avgReward" stroke="#10b981" dot={false} name="Avg Reward" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Training Logs */}
                {selectedRun.metrics.logs && selectedRun.metrics.logs.length > 0 && (
                  <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Training Logs</h2>
                    <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto">
                      {selectedRun.metrics.logs.map((log, idx) => (
                        <p key={idx}>{log}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 text-lg">Select a training run to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}