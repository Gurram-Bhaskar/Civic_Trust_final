import React from 'react';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

const Leaderboard = ({ onBack }) => {
    const { civicScore } = useCivic();

    // Create leaderboard data and sort by score (descending)
    const leadersData = [
        { id: 1, name: "Sarah Jenkins", score: 450 },
        { id: 2, name: "Mike Ross", score: 380 },
        { id: 3, name: "You", score: civicScore }, // Dynamic score
        { id: 4, name: "Priya Patel", score: 310 },
        { id: 5, name: "David Kim", score: 290 },
    ];

    // Sort by score in descending order and assign ranks
    const leaders = leadersData
        .sort((a, b) => b.score - a.score)
        .map((leader, index) => ({
            ...leader,
            rank: index + 1
        }));

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-slate-400" />;
            case 3: return <Medal className="w-6 h-6 text-amber-600" />;
            default: return <span className="font-bold text-slate-400 w-6 text-center">{rank}</span>;
        }
    };

    return (
        <div className="p-4">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
            </button>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Leaderboard</h2>
                <Award className="w-8 h-8 text-blue-500" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {leaders.map((leader) => (
                    <div
                        key={leader.id}
                        className={`flex items-center justify-between p-4 border-b border-slate-50 last:border-0 ${leader.name === 'You' ? 'bg-blue-50/50' : ''
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8">
                                {getRankIcon(leader.rank)}
                            </div>
                            <div>
                                <p className={`font-semibold ${leader.name === 'You' ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {leader.name}
                                </p>
                                <p className="text-xs text-slate-400">Level {Math.floor(leader.score / 100) + 1} Citizen</p>
                            </div>
                        </div>
                        <div className="font-bold text-slate-800">
                            {leader.score} <span className="text-xs font-normal text-slate-400">pts</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
