function EnvironmentCard({ env, onClick }) {
  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer"
      onClick={onClick}
    >
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
          <span>Explore</span>
        </button>
      </div>
    </div>
  );
}

export default EnvironmentCard;