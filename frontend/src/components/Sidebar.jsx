function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'environments', icon: '📊', label: 'Environments' },
    { id: 'history', icon: '📜', label: 'History' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className={`bg-gradient-to-b from-indigo-600 to-purple-700 text-white w-72 space-y-6 py-7 px-4 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-300 ease-in-out shadow-2xl z-50`}>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-lg p-2 text-2xl">⚡</div>
          <span className="text-2xl font-bold">MARL-Gym</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.id);
            }}
            className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 text-left ${
              activeTab === item.id
                ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
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
  );
}

export default Sidebar;