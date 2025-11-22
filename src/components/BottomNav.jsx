import React from 'react';
import { Home, PlusCircle, FileText, User, Users } from 'lucide-react';

const BottomNav = ({ currentView, onNavigate }) => {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home' },
        { id: 'my-reports', icon: FileText, label: 'Reports' },
        { id: 'report', icon: PlusCircle, label: 'Report', isPrimary: true },
        { id: 'validation', icon: Users, label: 'Community' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="bg-white border-t border-slate-100 p-2 px-6 flex justify-between items-center relative z-50">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${item.isPrimary ? '-mt-8' : ''
                        }`}
                >
                    <div
                        className={`
              flex items-center justify-center transition-all duration-300
              ${item.isPrimary
                                ? 'w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:scale-110 hover:shadow-blue-600/50'
                                : currentView === item.id
                                    ? 'w-10 h-10 rounded-xl bg-blue-50 text-blue-600'
                                    : 'w-10 h-10 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                            }
            `}
                    >
                        <item.icon className={item.isPrimary ? 'w-6 h-6' : 'w-5 h-5'} />
                    </div>
                    {!item.isPrimary && (
                        <span className={`text-[10px] font-medium ${currentView === item.id ? 'text-blue-600' : 'text-slate-400'
                            }`}>
                            {item.label}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default BottomNav;
