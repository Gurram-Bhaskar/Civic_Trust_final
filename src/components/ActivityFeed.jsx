import React from 'react';
import { MapPin, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useCivic } from '../context/CivicContext';

const ActivityFeed = ({ onNavigate }) => {
    const { reports } = useCivic();

    // Sort reports by timestamp (mock logic for now, just taking the first few)
    const recentReports = reports.slice(0, 5);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'Pending Validation': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="space-y-4">
            {recentReports.map((report) => (
                <div
                    key={report.id}
                    onClick={() => onNavigate('report-details', report.id)}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                >
                    <div className="flex gap-4">
                        <div className="relative w-20 h-20 shrink-0">
                            <img
                                src={report.image}
                                alt={report.type}
                                className="w-full h-full object-cover rounded-xl"
                            />
                            <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-full border-2 border-white ${report.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}>
                                {report.status === 'Resolved' ? (
                                    <CheckCircle className="w-3 h-3 text-white" />
                                ) : (
                                    <AlertTriangle className="w-3 h-3 text-white" />
                                )}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-800 truncate pr-2">{report.type}</h4>
                                <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {report.timestamp}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3" /> {report.location}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(report.status)}`}>
                                    {report.status}
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
