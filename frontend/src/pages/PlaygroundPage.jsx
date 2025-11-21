function PlaygroundPage({ env, code, setCode, onBack, onStartTraining }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/70 backdrop-blur-md shadow-lg border-b border-white/50">
          <div className="flex items-center py-4 px-6 space-x-4">
            <button onClick={onBack} className="text-gray-700 hover:text-indigo-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {env.name} Playground
              </h1>
              <p className="text-sm text-gray-600">Configure and train your agent</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Environment Info */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Environment Header */}
              <div className={`bg-gradient-to-br ${env.color} rounded-2xl p-8 text-white shadow-xl`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-6xl">{env.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold">{env.name}</h2>
                    <p className="text-white/90">{env.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-white/80 mb-1">Action Space</p>
                    <p className="font-bold text-lg">{env.actionSpace}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-white/80 mb-1">Observation Space</p>
                    <p className="font-bold text-lg">{env.observationSpace}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {env.details && (
                <>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">📖 Description</h3>
                    <p className="text-gray-700 leading-relaxed">{env.details.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🎮 Action Space</h3>
                    <div className="space-y-3">
                      {env.details.actions.map((action, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                            {action.value}
                          </div>
                          <p className="text-gray-700 pt-1">{action.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observations */}
                  {env.details.observations && env.details.observations.length > 1 && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">👁️ Observation Space</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Index</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Observation</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Min</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Max</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {env.details.observations.map((obs, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-semibold text-indigo-600">{obs.index}</td>
                                <td className="px-4 py-3 text-gray-700 font-medium">{obs.name}</td>
                                <td className="px-4 py-3 text-gray-600">{obs.min}</td>
                                <td className="px-4 py-3 text-gray-600">{obs.max}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Rewards & Termination */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">🎁 Rewards</h3>
                      <p className="text-gray-700">{env.details.reward}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">🏁 Episode Termination</h3>
                      <ul className="space-y-2">
                        {env.details.termination.map((term, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span className="text-gray-700">{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Code Editor */}
          <div className="w-1/2 bg-gray-900 flex flex-col border-l border-gray-700">
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-gray-300 font-mono text-sm">training_code.py</span>
              </div>
              <button 
                onClick={onStartTraining}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Start Training</span>
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-6 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaygroundPage;