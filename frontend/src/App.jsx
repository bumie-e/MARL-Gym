import { useState } from 'react';

function App() {
  const prebuiltEnvironments = [
    { name: 'GridWorld', description: 'A simple grid world environment.', color: 'from-purple-500 to-pink-500', icon: '🎯' },
    { name: 'CartPole', description: 'Balancing a pole on a cart.', color: 'from-blue-500 to-cyan-500', icon: '⚖️' },
    { name: 'MountainCar', description: 'Driving a car up a mountain.', color: 'from-green-500 to-emerald-500', icon: '🚗' },
    { name: 'FrozenLake', description: 'Navigating a frozen lake.', color: 'from-indigo-500 to-purple-500', icon: '❄️' },
  ];

  const trainingHistory = [
    { name: 'GridWorld-PPO-1', status: 'Completed', date: '2025-11-20', progress: 100 },
    { name: 'CartPole-DQN-1', status: 'Running', date: '2025-11-19', progress: 67 },
    { name: 'MountainCar-A2C-1', status: 'Failed', date: '2025-11-18', progress: 34 },
    { name: 'FrozenLake-PPO-1', status: 'Completed', date: '2025-11-17', progress: 100 },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const stats = [
    { label: 'Active Runs', value: '1', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
    { label: 'Completed', value: '2', icon: '✓', color: 'from-green-400 to-emerald-500' },
    { label: 'Environments', value: '4', icon: '📦', color: 'from-blue-400 to-cyan-500' },
    { label: 'Total Runs', value: '4', icon: '🕐', color: 'from-purple-400 to-pink-500' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-indigo-600 to-purple-700 text-white w-72 space-y-6 py-7 px-4 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-300 ease-in-out shadow-2xl z-50`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-lg p-2 text-2xl">
              ⚡
            </div>
            <span className="text-2xl font-bold">MARL-Gym</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'environments', icon: '📊', label: 'Environments' },
            { id: 'history', icon: '📜', label: 'History' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                  : 'hover:bg-white/10 hover:translate-x-1'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-8 left-4 right-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-sm text-white/80 mb-2">Need help?</p>
            <button className="w-full bg-white text-indigo-600 py-2 px-4 rounded-lg font-semibold hover:bg-indigo-50 transition duration-200">
              Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/70 backdrop-blur-md shadow-lg border-b border-white/50">
          <div className="flex justify-between items-center py-4 px-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-700 focus:outline-none md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">Friday, November 21, 2025</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition duration-200">
                U
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome back! 👋</h2>
              <p className="text-gray-600 text-lg">Here's what's happening with your agents today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 text-2xl`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Pre-built Environments */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Pre-built Environments</h3>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 hover:-translate-y-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create New</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {prebuiltEnvironments.map((env, index) => (
                  <div key={index} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                    <div className={`h-32 bg-gradient-to-br ${env.color} flex items-center justify-center text-6xl transform group-hover:scale-110 transition duration-300`}>
                      {env.icon}
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-xl mb-2 text-gray-800">{env.name}</h4>
                      <p className="text-gray-600 text-sm mb-4">{env.description}</p>
                      <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span>Train Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training History */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Training History</h3>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trainingHistory.map((run, index) => (
                        <tr key={index} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition duration-200">
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{run.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                              run.status === 'Completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                              run.status === 'Running' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                              'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                            }`}>
                              {run.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    run.status === 'Completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                    run.status === 'Running' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                    'bg-gradient-to-r from-red-400 to-pink-500'
                                  }`}
                                  style={{ width: `${run.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 font-medium">{run.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{run.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center space-x-1 font-semibold hover:underline">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View</span>
                            </button>
                            <button className="text-red-600 hover:text-red-900 inline-flex items-center space-x-1 font-semibold hover:underline">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;