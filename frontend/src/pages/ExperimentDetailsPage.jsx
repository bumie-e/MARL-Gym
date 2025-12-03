import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExperimentDetailsPage = ({ onNavClick }) => {
    const { id } = useParams();
    const [experiment, setExperiment] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchExperiment = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/training-history/${id}`);
                setExperiment(response.data);
            } catch (error) {
                console.error(`Error fetching experiment ${id}:`, error);
            }
        };

        fetchExperiment();
    }, [id]);

    if (!experiment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Sidebar onNavClick={onNavClick} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar 
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    title={`Experiment ${id}`}
                    subtitle={`Details for ${experiment.environment} - ${experiment.agent}`}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Episode Rewards</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={experiment.metrics.episode_rewards.map((reward, idx) => ({ episode: idx + 1, reward }))}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="episode" stroke="#9ca3af" />
                                            <YAxis stroke="#9ca3af" />
                                            <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="reward" stroke="#6366f1" dot={false} name="Episode Reward" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Environment:</span>
                                            <span className="font-semibold text-gray-800">{experiment.environment}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Agent:</span>
                                            <span className="font-semibold text-gray-800">{experiment.agent}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Episodes:</span>
                                            <span className="font-semibold text-gray-800">{experiment.episodes}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Reward:</span>
                                            <span className="font-semibold text-gray-800">{experiment.reward}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className="font-semibold text-gray-800">{experiment.status}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Created At:</span>
                                            <span className="font-semibold text-gray-800">{new Date(experiment.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ExperimentDetailsPage;
