import { useState } from 'react';
import Sidebar from '../components/SideBar';
import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import EnvironmentCard from '../components/EnvironmentCard';

function Dashboard({ environments, onEnvClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const stats = [
    { label: 'Active Runs', value: '1', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
    { label: 'Completed', value: '2', icon: '✓', color: 'from-green-400 to-emerald-500' },
    { label: 'Environments', value: '4', icon: '📦', color: 'from-blue-400 to-cyan-500' },
    { label: 'Total Runs', value: '4', icon: '🕐', color: 'from-purple-400 to-pink-500' },
  ];

  const trainingHistory = [
    { name: 'GridWorld-PPO-1', status: 'Completed', date: '2025-11-20', progress: 100 },
    { name: 'CartPole-DQN-1', status: 'Running', date: '2025-11-19', progress: 67 },
    { name: 'MountainCar-A2C-1', status: 'Failed', date: '2025-11-18', progress: 34 },
    { name: 'FrozenLake-PPO-1', status: 'Completed', date: '2025-11-17', progress: 100 },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="Dashboard"
          subtitle="Friday, November 21, 2025"
        />

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
                <StatsCard key={index} stat={stat} />
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
                {environments.map((env, index) => (
                  <EnvironmentCard 
                    key={index}
                    env={env}
                    onClick={() => onEnvClick(env)}
                  />
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

export default Dashboard;