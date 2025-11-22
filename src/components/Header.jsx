import React from 'react';
import { Shield, Bell } from 'lucide-react';
import { useCivic } from '../context/CivicContext';

const Header = () => {
    const { civicScore } = useCivic();

    const handleProfileClick = () => {
        const event = new CustomEvent('navigate', { detail: 'profile' });
        window.dispatchEvent(event);
    };

    return (
        <header className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm/50">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Shield className="w-5 h-5 text-white fill-current" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">CivicTrust</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                {/* XP Badge */}
                <button
                    onClick={handleProfileClick}
                    className="bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-slate-200 transition-colors"
                >
                    <span className="text-blue-600 font-bold text-xs">XP</span>
                    <span className="font-bold text-slate-900 text-sm">{civicScore}</span>
                </button>

                {/* Notification Bell */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
