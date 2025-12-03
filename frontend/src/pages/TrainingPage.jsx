import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EnvironmentRenderer from '../components/EnvironmentRender';

// MetricsPanel Component (Unchanged)
function MetricsPanel({ metrics, episode, elapsedTime }) {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="w-80 bg-white/70 backdrop-blur-md border-l border-gray-200 overflow-y-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-4">
        <p className="text-sm text-gray-600 mb-1">Total Timesteps</p>
        <p className="text-3xl font-bold text-indigo-600">{metrics.timesteps?.toLocaleString() || 0}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4">
        <p className="text-sm text-gray-600 mb-1">Episodes Completed</p>
        <p className="text-3xl font-bold text-purple-600">{metrics.episodes || 0}</p>
      </div>

      <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4">
        <p className="text-sm text-gray-600 mb-1">Current Episode Reward</p>
        <p className="text-3xl font-bold text-green-600">{metrics.current_episode_reward?.toFixed(2) || 'N/A'}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4">
        <p className="text-sm text-gray-600 mb-1">Avg Reward (Last 100)</p>
        <p className="text-3xl font-bold text-blue-600">{metrics.mean_reward?.toFixed(2) || 'N/A'}</p>
      </div>

      {metrics.eval_mean_reward !== null && (
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4">
          <p className="text-sm text-gray-600 mb-1">Evaluation Reward</p>
          <p className="text-3xl font-bold text-yellow-600">{metrics.eval_mean_reward?.toFixed(2)}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-4">
        <p className="text-sm text-gray-600 mb-1">Std Reward</p>
        <p className="text-2xl font-bold text-red-600">{metrics.std_reward?.toFixed(2) || 'N/A'}</p>
      </div>

      <div className="bg-gradient-to-br from-gray-100 to-slate-100 rounded-2xl p-4">
        <p className="text-sm text-gray-600 mb-1">Elapsed Time</p>
        <p className="text-2xl font-bold text-gray-700">{formatTime(elapsedTime)}</p>
      </div>
    </div>
  );
}

export default function TrainingPage({
  jobId,
  env,
  isTraining,
  progress,
  episode,
  status, // 'queued', 'training', 'completed', 'stopped', 'failed'
  error,
  metrics,
  elapsedTime,
  onBack, // Handles "Back to Playground"
  onStop, // Handles "Stop Training"
}) {
  const estimatedTimeRemaining = Math.max(0, Math.floor((100 - progress) * 0.5));
  const [chartData, setChartData] = useState([]);

  // Base URL for downloads
  const API_BASE_URL = 'https://bumie-e-marl-gym.hf.space';

  useEffect(() => {
    if (metrics?.episode_rewards) {
      const newData = metrics.episode_rewards.map((reward, idx) => ({
        episode: idx + 1,
        reward: reward,
        avgReward: metrics.mean_reward || reward,
      }));
      setChartData(newData);
    }
  }, [metrics?.episode_rewards, metrics?.mean_reward]);

  const handleDownload = (type) => {
    if (!jobId) return;
    const downloadUrl = `${API_BASE_URL}/download/${jobId}/${type}`;
    window.open(downloadUrl, '_blank');
  };

  // Helper to determine if we should show results (Completed OR Stopped)
  const showResults = status === 'completed' || status === 'stopped';

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/70 backdrop-blur-md shadow-lg border-b border-white/50">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="text-gray-700 hover:text-indigo-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Training {env?.name || 'Agent'}
                </h1>
                <p className="text-sm text-gray-600">
                  {status === 'training' ? 'Training in progress...' : 
                   status === 'completed' ? 'Training completed successfully' : 
                   status === 'stopped' ? 'Training stopped by user' : 
                   'Initializing...'}
                </p>
              </div>
            </div>
            
            {/* Context-aware Button */}
            {isTraining ? (
              <button
                onClick={onStop}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 animate-pulse">
                Stop Training
              </button>
            ) : (
              <button
                onClick={onBack}
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-bold py-2 px-6 rounded-lg shadow-sm transition-all duration-200">
                Back to Playground
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Visualization */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Progress Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Training Progress</h3>
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${
                      status === 'failed' ? 'bg-red-500' :
                      status === 'stopped' ? 'bg-yellow-500' :
                      'bg-gradient-to-r from-indigo-500 to-purple-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Episode</p>
                    <p className="text-2xl font-bold text-gray-800">{episode}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                    <p className="text-2xl font-bold text-gray-800">{isTraining ? `${estimatedTimeRemaining}s` : '-'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                        status === 'training' ? 'bg-blue-100 text-blue-700' :
                        status === 'completed' ? 'bg-green-100 text-green-700' :
                        status === 'stopped' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {status === 'training' ? '🔄 Running' : 
                       status === 'completed' ? '✅ Done' : 
                       status === 'stopped' ? '⏹️ Stopped' : '❌ Error'}
                    </span>
                  </div>
                </div>
              </div>

              {/* RESULTS & DOWNLOADS SECTION (Shows for Completed OR Stopped) */}
              {showResults && (
                <div className={`rounded-2xl p-6 shadow-lg border animate-fade-in-up ${
                  status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-xl font-bold ${status === 'completed' ? 'text-green-800' : 'text-yellow-800'}`}>
                        {status === 'completed' ? 'Training Successful!' : 'Training Stopped'}
                      </h3>
                      <p className={`${status === 'completed' ? 'text-green-700' : 'text-yellow-700'} text-sm mt-1`}>
                        {status === 'completed' 
                          ? 'Your agent is ready for deployment.' 
                          : 'You can download the partial model and video.'}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      {/* Model Download */}
                      <button 
                        onClick={() => handleDownload('model')}
                        className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>Download Model</span>
                      </button>
                      
                      {/* Video Download */}
                      <button 
                         onClick={() => handleDownload('video')}
                         className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Download Replay</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Environment Visualization */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Environment Rendering</h3>
                <EnvironmentRenderer 
                  jobId={jobId}
                  isTraining={isTraining} 
                  env={env}
                />
              </div>

              {/* Training Logs */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Training Logs</h3>
                <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-48 overflow-y-auto">
                  {metrics?.logs && metrics.logs.length > 0 ? (
                    metrics.logs.slice().reverse().map((log, idx) => (
                      <p key={idx}>{log}</p>
                    ))
                  ) : (
                    <>
                      <p>[00:00] Initializing environment...</p>
                      <p>[00:01] Waiting for training start...</p>
                    </>
                  )}
                </div>
              </div>

              {/* Reward Chart */}
              {chartData.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Episode Rewards</h3>
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

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 rounded-2xl p-6 shadow-lg border border-red-200">
                  <h3 className="text-xl font-bold text-red-800 mb-2">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Metrics */}
          <MetricsPanel metrics={metrics} episode={episode} elapsedTime={elapsedTime} />
        </div>
      </div>
    </div>
  );
}