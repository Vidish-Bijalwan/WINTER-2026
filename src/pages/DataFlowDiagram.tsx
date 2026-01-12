import React, { useState } from 'react';
import { Database, Activity, Brain, BarChart3, Users, Server, Zap, Shield, ArrowRight, GitBranch, Cpu, Eye, TrendingUp } from 'lucide-react';

const DataFlowDiagram = () => {
    const [selectedLevel, setSelectedLevel] = useState('context');

    const ContextDiagram = () => (
        <div className="relative w-full h-full flex items-center justify-center p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-10 shadow-2xl border border-blue-400/30 w-72 h-72 flex flex-col items-center justify-center backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                    <Activity className="w-20 h-20 text-white mb-4 animate-pulse" />
                    <h3 className="text-white font-bold text-2xl text-center relative z-10">TopoShape Insights</h3>
                    <p className="text-blue-200 text-sm text-center mt-2 relative z-10">TDA Anomaly Detection</p>
                    <div className="mt-4 flex gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>

            <div className="absolute top-12 left-12 group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-xl w-56 transform transition-all duration-300 hover:scale-105 border border-green-300/30">
                    <Users className="w-14 h-14 text-white mb-3" />
                    <h4 className="text-white font-bold text-lg">User/Analyst</h4>
                    <p className="text-green-100 text-xs mt-1">Dashboard Access</p>
                </div>
                <svg className="absolute top-28 left-56" width="280" height="140">
                    <defs>
                        <marker id="arrowgreen1" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto">
                            <polygon points="0 0, 12 3, 0 6" fill="#10b981" />
                        </marker>
                    </defs>
                    <path d="M 0 20 Q 140 20 260 90" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrowgreen1)" opacity="0.8" />
                    <text x="90" y="15" fill="#10b981" fontSize="13" fontWeight="700">Views Dashboard</text>
                </svg>
            </div>

            <div className="absolute top-12 right-12 group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 shadow-xl w-56 transform transition-all duration-300 hover:scale-105 border border-purple-300/30">
                    <Zap className="w-14 h-14 text-white mb-3" />
                    <h4 className="text-white font-bold text-lg">Wikipedia SSE</h4>
                    <p className="text-purple-100 text-xs mt-1">Real-time Stream</p>
                </div>
                <svg className="absolute top-28 right-56" width="280" height="140">
                    <defs>
                        <marker id="arrowpurple1" markerWidth="12" markerHeight="12" refX="2" refY="3" orient="auto">
                            <polygon points="12 0, 0 3, 12 6" fill="#a855f7" />
                        </marker>
                    </defs>
                    <path d="M 280 20 Q 140 20 20 90" stroke="#a855f7" strokeWidth="3" fill="none" markerEnd="url(#arrowpurple1)" opacity="0.8" />
                    <text x="100" y="15" fill="#c084fc" fontSize="13" fontWeight="700">Events</text>
                </svg>
            </div>

            <div className="absolute bottom-12 left-12 group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 shadow-xl w-56 transform transition-all duration-300 hover:scale-105 border border-emerald-300/30">
                    <Database className="w-14 h-14 text-white mb-3" />
                    <h4 className="text-white font-bold text-lg">MongoDB Atlas</h4>
                    <p className="text-emerald-100 text-xs mt-1">Storage</p>
                </div>
            </div>

            <div className="absolute bottom-12 right-12 group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 shadow-xl w-56 transform transition-all duration-300 hover:scale-105 border border-orange-300/30">
                    <Brain className="w-14 h-14 text-white mb-3" />
                    <h4 className="text-white font-bold text-lg">TopoForge API</h4>
                    <p className="text-orange-100 text-xs mt-1">TDA Engine</p>
                </div>
            </div>
        </div>
    );

    const Level1Diagram = () => (
        <div className="w-full h-full overflow-auto p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="min-w-[1200px] space-y-8">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-500/30 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                            <BarChart3 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-blue-300 font-bold text-xl">Frontend Layer</h3>
                            <p className="text-blue-400 text-sm">React 18 • TypeScript</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-blue-500/20 hover:border-blue-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <Eye className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">User Interface</p>
                            <p className="text-sm text-blue-300">Dashboard</p>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-blue-500/20 hover:border-blue-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">Authentication</p>
                            <p className="text-sm text-blue-300">JWT</p>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-blue-500/20 hover:border-blue-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <Activity className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">Visualization</p>
                            <p className="text-sm text-blue-300">Charts</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/30 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-600 rounded-xl shadow-lg">
                            <Brain className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-purple-300 font-bold text-xl">Processing Layer</h3>
                            <p className="text-purple-400 text-sm">TDA Engine</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-purple-500/20 hover:border-purple-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">Stream Processor</p>
                            <p className="text-sm text-purple-300">SSE Client</p>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-purple-500/20 hover:border-purple-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                <Cpu className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">TDA Engine</p>
                            <p className="text-sm text-purple-300">Web Worker</p>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-purple-500/20 hover:border-purple-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">Anomaly Detector</p>
                            <p className="text-sm text-purple-300">Multi-Modal</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-500/30 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-600 rounded-xl shadow-lg">
                            <Database className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-green-300 font-bold text-xl">Storage Layer</h3>
                            <p className="text-green-400 text-sm">In-Memory & Persistent</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-green-500/20 hover:border-green-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                                <Database className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">Event Buffer</p>
                            <p className="text-sm text-green-300">Max 2000 events</p>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-green-500/20 hover:border-green-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                                <GitBranch className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">Persistence Cache</p>
                            <p className="text-sm text-green-300">Diagrams</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500/30 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-orange-600 rounded-xl shadow-lg">
                            <Server className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-orange-300 font-bold text-xl">Backend Services</h3>
                            <p className="text-orange-400 text-sm">Microservices</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-orange-500/20 hover:border-orange-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <Server className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">REST API</p>
                            <p className="text-sm text-orange-300">FastAPI</p>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-orange-500/20 hover:border-orange-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">ML Service</p>
                            <p className="text-sm text-orange-300">TDA</p>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-6 shadow-lg border border-orange-500/20 hover:border-orange-400/40 transition-all transform hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <Database className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white mb-1">MongoDB</p>
                            <p className="text-sm text-orange-300">Database</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const TDAPipeline = () => (
        <div className="w-full h-full overflow-auto p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="min-w-[1000px] max-w-6xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">TDA Processing Pipeline</h2>
                    <p className="text-slate-400">6-Stage Data Transformation</p>
                </div>
                <div className="space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 shadow-2xl w-80 transform hover:scale-105 transition-all">
                            <Zap className="w-12 h-12 text-white mb-4" />
                            <h4 className="text-white font-bold text-xl mb-2">Input Stage</h4>
                            <p className="text-indigo-100">Wikipedia Events</p>
                            <p className="text-indigo-200 text-sm mt-2">JSON Stream Parsing</p>
                        </div>
                        <ArrowRight className="w-8 h-8 text-indigo-400" />
                    </div>

                    <div className="flex items-center gap-6 flex-row-reverse">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 shadow-2xl w-80 transform hover:scale-105 transition-all">
                            <Activity className="w-12 h-12 text-white mb-4" />
                            <h4 className="text-white font-bold text-xl mb-2">Graph Construction</h4>
                            <p className="text-purple-100">Adjacency Matrix</p>
                            <p className="text-purple-200 text-sm mt-2">User-Page Network</p>
                        </div>
                        <ArrowRight className="w-8 h-8 text-purple-400 transform rotate-180" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-8 shadow-2xl w-80 transform hover:scale-105 transition-all">
                            <Brain className="w-12 h-12 text-white mb-4" />
                            <h4 className="text-white font-bold text-xl mb-2">TDA Filtration</h4>
                            <p className="text-pink-100">Vietoris-Rips</p>
                            <p className="text-pink-200 text-sm mt-2">Simplicial Complex</p>
                        </div>
                        <ArrowRight className="w-8 h-8 text-pink-400" />
                    </div>

                    <div className="flex items-center gap-6 flex-row-reverse">
                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-8 shadow-2xl w-80 transform hover:scale-105 transition-all">
                            <BarChart3 className="w-12 h-12 text-white mb-4" />
                            <h4 className="text-white font-bold text-xl mb-2">Persistence</h4>
                            <p className="text-rose-100">Diagram Generation</p>
                            <p className="text-rose-200 text-sm mt-2">Birth-Death Pairs</p>
                        </div>
                        <ArrowRight className="w-8 h-8 text-rose-400 transform rotate-180" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 shadow-2xl w-80 transform hover:scale-105 transition-all">
                            <TrendingUp className="w-12 h-12 text-white mb-4" />
                            <h4 className="text-white font-bold text-xl mb-2">Feature Extraction</h4>
                            <p className="text-orange-100">Multi-Modal</p>
                            <p className="text-orange-200 text-sm mt-2">Wasserstein + Landscapes</p>
                        </div>
                        <ArrowRight className="w-8 h-8 text-orange-400" />
                    </div>

                    <div className="flex items-center gap-6 flex-row-reverse">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-8 shadow-2xl w-80 transform hover:scale-105 transition-all">
                            <Shield className="w-12 h-12 text-white mb-4" />
                            <h4 className="text-white font-bold text-xl mb-2">Anomaly Detection</h4>
                            <p className="text-red-100">Scoring & Alerts</p>
                            <p className="text-red-200 text-sm mt-2">0-10 Scale</p>
                        </div>
                        <ArrowRight className="w-8 h-8 text-red-400 transform rotate-180" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden">
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                TopoShape Insights
                            </h1>
                            <p className="text-slate-400 text-sm">Real-time Anomaly Detection</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-slate-300 text-sm">Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setSelectedLevel('context')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedLevel === 'context'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                            }`}
                    >
                        Level 0: Context
                    </button>
                    <button
                        onClick={() => setSelectedLevel('level1')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedLevel === 'level1'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                            }`}
                    >
                        Level 1: System
                    </button>
                    <button
                        onClick={() => setSelectedLevel('pipeline')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedLevel === 'pipeline'
                            ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                            }`}
                    >
                        Level 2: Pipeline
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {selectedLevel === 'context' && <ContextDiagram />}
                {selectedLevel === 'level1' && <Level1Diagram />}
                {selectedLevel === 'pipeline' && <TDAPipeline />}
            </div>

            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 p-4">
                <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded"></div>
                        <span className="text-slate-300">Frontend</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded"></div>
                        <span className="text-slate-300">Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded"></div>
                        <span className="text-slate-300">Storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded"></div>
                        <span className="text-slate-300">Backend</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataFlowDiagram;
