import React from 'react';
import { ChevronRight } from 'lucide-react';

const ActionCard = ({ title, icon: Icon, color, onClick, subtitle }) => {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all active:scale-[0.98]"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                <div className="text-left">
                    <h3 className="font-semibold text-slate-800">{title}</h3>
                    {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
    );
};

export default ActionCard;
