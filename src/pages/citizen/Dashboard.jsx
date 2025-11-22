import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import ActivityFeed from '../../components/ActivityFeed';
import { useCivic } from '../../context/CivicContext';
import { useAuth } from '../../context/AuthContext';

const Dashboard = ({ onNavigate }) => {
    const { civicScore, reports } = useCivic();
    const { user } = useAuth();

    // Calculate resolved reports count
    const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

    // Calculate community rank based on civic score
    // Mock calculation: higher score = better rank
    const calculateRank = (score) => {
        if (score >= 200) return 'Top 1%';
        if (score >= 150) return 'Top 5%';
        if (score >= 100) return 'Top 10%';
        if (score >= 50) return 'Top 25%';
        return 'Top 50%';
    };

    const communityRank = calculateRank(civicScore);

    return (
        <div className="p-6 space-y-8">
            {/* Welcome Section */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Hello, {user?.name?.split(' ')[0] || 'Citizen'}! 👋</h2>
                <p className="text-slate-500 text-lg">Let's make our city better together.</p>
            </div>

            {/* Main Action Card - Report Issue */}
            <button
                onClick={() => onNavigate('report')}
                className="w-full bg-blue-600 rounded-3xl p-6 text-left relative overflow-hidden shadow-xl shadow-blue-600/20 group transition-transform active:scale-95"
            >
                {/* Background Decoration */}
                <div className="absolute -right-10 -bottom-10 text-blue-500/20 rotate-12">
                    <AlertTriangle className="w-48 h-48" />
                </div>

                <div className="relative z-10">
                    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">Report Issue</h3>
                    <p className="text-blue-100">Spot a problem? Let us know.</p>
                </div>
            </button>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Resolved Card */}
                <button
                    onClick={() => onNavigate('my-reports')}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-left transition-all hover:shadow-md hover:scale-[1.02] active:scale-95"
                >
                    <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="text-3xl font-bold text-slate-900">{resolvedCount}</h4>
                    <p className="text-slate-500 text-sm font-medium">Issues Resolved</p>
                </button>

                {/* Rank Card */}
                <button
                    onClick={() => onNavigate('leaderboard')}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-left transition-all hover:shadow-md hover:scale-[1.02] active:scale-95"
                >
                    <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mt-2">{communityRank}</h4>
                    <p className="text-slate-500 text-sm font-medium">Community Rank</p>
                </button>
            </div>

            {/* Recent Activity Header */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                    <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                        View All <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <ActivityFeed onNavigate={onNavigate} />
            </div>
        </div>
    );
};

export default Dashboard;
