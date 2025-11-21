function MetricsPanel({ metrics, episode }) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Training Metrics</h3>
      
      {/* Mean Reward Chart */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-3">
          <h4 className="font-bold text-gray-800 mb-2">📈 Mean Reward</h4>
          <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {metrics.meanReward[Math.min(episode, metrics.meanReward.length - 1)]?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 h-48 flex items-end space-x-1">
          {metrics.meanReward.slice(0, 20).map((reward, idx) => (
            <div 
              key={idx}
              className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t transition-all duration-300"
              style={{ 
                height: `${(reward / 500) * 100}%`,
                opacity: idx <= episode / 5 ? 1 : 0.3
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Loss Chart */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 mb-3">
          <h4 className="font-bold text-gray-800 mb-2">📉 Loss</h4>
          <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            {metrics.loss[Math.min(episode, metrics.loss.length - 1)]?.toFixed(4) || '0.0000'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 h-48 flex items-end space-x-1">
          {metrics.loss.slice(0, 20).map((loss, idx) => (
            <div 
              key={idx}
              className="flex-1 bg-gradient-to-t from-red-500 to-pink-600 rounded-t transition-all duration-300"
              style={{ 
                height: `${loss * 100}%`,
                opacity: idx <= episode / 5 ? 1 : 0.3
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
        <h4 className="font-bold mb-4">📊 Statistics</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/80">Max Reward:</span>
            <span className="font-bold">{Math.max(...metrics.meanReward.slice(0, episode)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Min Loss:</span>
            <span className="font-bold">{Math.min(...metrics.loss.slice(0, episode)).toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Avg Reward:</span>
            <span className="font-bold">
              {(metrics.meanReward.slice(0, episode).reduce((a, b) => a + b, 0) / Math.max(1, episode)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Model Info */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-bold text-gray-800 mb-3">🤖 Model Configuration</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Algorithm:</span>
            <span className="font-semibold text-gray-800">PPO</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Learning Rate:</span>
            <span className="font-semibold text-gray-800">0.001</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Batch Size:</span>
            <span className="font-semibold text-gray-800">64</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Steps:</span>
            <span className="font-semibold text-gray-800">100,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsPanel;