import MetricsPanel from '../components/MetricsPanel';

function TrainingPage({ env, isTraining, progress, episode, metrics, onBack, onStop }) {
  const estimatedTimeRemaining = Math.max(0, Math.floor((100 - progress) * 0.5));
  
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
                  Training {env.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {isTraining ? 'Training in progress...' : 'Training completed'}
                </p>
              </div>
            </div>
            <button 
              onClick={onStop}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200">
              {isTraining ? 'Stop Training' : 'Back to Playground'}
            </button>
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
                    className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
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
                    <p className="text-2xl font-bold text-gray-800">{estimatedTimeRemaining}s</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                      isTraining ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                    }`}>
                      {isTraining ? '🔄 Running' : '✅ Done'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Environment Visualization */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Environment Rendering</h3>
                <div className={`bg-gradient-to-br ${env.color} rounded-xl p-12 flex items-center justify-center min-h-[400px] relative overflow-hidden`}>
                  <div className="relative">
                    <div className="text-8xl mb-4 animate-bounce">{env.icon}</div>
                    <p className="text-white text-center font-bold text-xl">Episode {episode}</p>
                    {isTraining && (
                      <div className="absolute -top-4 -right-4">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  {isTraining && (
                    <>
                      <div className="absolute top-10 left-10 w-3 h-3 bg-white rounded-full animate-ping"></div>
                      <div className="absolute bottom-10 right-10 w-3 h-3 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-1/2 left-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="absolute top-1/3 right-20 w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    </>
                  )}
                </div>
              </div>

              {/* Training Logs */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Training Logs</h3>
                <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-48 overflow-y-auto">
                  <p>[00:00] Initializing environment: {env.name}</p>
                  <p>[00:01] Creating PPO agent with MlpPolicy...</p>
                  <p>[00:02] Starting training for 100,000 timesteps</p>
                  <p>[00:03] Episode {Math.max(1, episode - 5)}: reward = {(Math.random() * 200 + 100).toFixed(2)}</p>
                  <p>[00:05] Episode {Math.max(1, episode - 4)}: reward = {(Math.random() * 250 + 150).toFixed(2)}</p>
                  <p>[00:07] Episode {Math.max(1, episode - 3)}: reward = {(Math.random() * 300 + 200).toFixed(2)}</p>
                  <p>[00:09] Episode {Math.max(1, episode - 2)}: reward = {(Math.random() * 350 + 250).toFixed(2)}</p>
                  <p>[00:11] Episode {Math.max(1, episode - 1)}: reward = {(Math.random() * 400 + 300).toFixed(2)}</p>
                  {isTraining && <p className="animate-pulse">[00:13] Episode {episode}: reward = {(Math.random() * 450 + 350).toFixed(2)}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Metrics */}
          <MetricsPanel metrics={metrics} episode={episode} />
        </div>
      </div>
    </div>
  );
}

export default TrainingPage;