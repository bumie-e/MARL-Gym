function TopBar({ sidebarOpen, setSidebarOpen, title, subtitle }) {
  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg border-b border-white/50">
      <div className="flex justify-between items-center py-4 px-6">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-700 focus:outline-none md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition duration-200">
            U
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;