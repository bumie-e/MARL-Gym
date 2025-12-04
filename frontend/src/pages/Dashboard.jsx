import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import EnvironmentCard from '../components/EnvironmentCard';


function Dashboard({ environments, onEnvClick, onNavClick, activeTab, setActiveTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [stats, setStats] = useState({
    activeRuns: 0,
    completed: 0,
    environments: environments.length,
    totalRuns: 0,
  });

  // Fetch training history on mount and set up polling
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/training-history/latest?limit=5');
        const data = await response.json();
        setTrainingHistory(data);

        // Calculate stats
        const completedCount = data.filter(run => run.status === 'completed').length;
        setStats(prev => ({
          ...prev,
          completed: completedCount,
          totalRuns: data.length,
        }));
      } catch (error) {
        console.error('Error fetching training history:', error);
      }
    };

    fetchHistory();
    
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchHistory, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Active Runs', value: stats.activeRuns.toString(), icon: '⚡', color: 'from-yellow-400 to-orange-500' },
    { label: 'Completed', value: stats.completed.toString(), icon: '✓', color: 'from-green-400 to-emerald-500' },
    { label: 'Environments', value: stats.environments.toString(), icon: '📦', color: 'from-blue-400 to-cyan-500' },
    { label: 'Total Runs', value: stats.totalRuns.toString(), icon: '🕐', color: 'from-purple-400 to-pink-500' },
  ];

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Sidebar 
        onNavClick={onNavClick}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="Dashboard"
          subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
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
              {statCards.map((stat, index) => (
                <StatsCard key={index} stat={stat} />
              ))}
            </div>

            {/* Pre-built Environments */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Pre-built Environments</h3>
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Training History (Latest 5)</h3>
                <button 
                  onClick={() => onNavClick && onNavClick('history')}
                  className="text-indigo-600 hover:text-indigo-900 font-semibold hover:underline">
                  View All →
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Environment</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Agent</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Episodes</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Reward</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trainingHistory.length > 0 ? (
                        trainingHistory.map((run) => (
                          <tr key={run.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition duration-200">
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-600">
                              {run.job_id ? run.job_id.substring(0, 8) + '...' : `Run #${run.id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                              {run.environment}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{run.agent}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                getStatusBadge(run.status)
                              }`}>
                                {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {run.metrics.episodes}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {run.results?.mean_reward?.toFixed(2) || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {new Date(run.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                            No training runs yet. Start by selecting an environment!
                          </td>
                        </tr>
                      )}
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