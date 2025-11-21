function StatsCard({ stat }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 text-2xl`}>
        {stat.icon}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
      <p className="text-gray-600 font-medium">{stat.label}</p>
    </div>
  );
}

export default StatsCard;