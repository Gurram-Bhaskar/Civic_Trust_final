import React from 'react';
import { ArrowLeft, User, Award, Star, Shield, LogOut } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { useAuth } from '../../context/AuthContext';

const Profile = ({ onBack, onNavigate }) => {
    const { civicScore, reports } = useCivic();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        // App.jsx will handle redirection to login
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-rose-600 font-medium hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                    <User className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{user?.name || 'Citizen'}</h2>
                <p className="text-slate-500">{user?.email}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{civicScore}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Civic Score</div>
                </div>
                <button
                    onClick={() => onNavigate('my-reports')}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center hover:bg-slate-50 transition-colors active:scale-95"
                >
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{reports.length}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Reports Filed</div>
                </button>
            </div>

            {/* Badges */}
            <h3 className="font-bold text-slate-800 mb-4 px-1">Earned Badges</h3>
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex flex-col items-center text-center">
                    <Award className="w-8 h-8 text-amber-500 mb-2" />
                    <span className="text-xs font-bold text-amber-800">First Step</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                    <Shield className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-xs font-bold text-blue-800">Guardian</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center text-center opacity-50 grayscale">
                    <Star className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-500">Super Star</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;
