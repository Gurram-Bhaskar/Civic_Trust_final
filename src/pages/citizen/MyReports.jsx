import React, { useState } from 'react';
import { ArrowLeft, Filter, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

const MyReports = ({ onBack, onNavigate }) => {
    const { reports } = useCivic();
    const [filter, setFilter] = useState('All');

    const filteredReports = reports.filter(r =>
        filter === 'All' ? true : r.status === filter
    );

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
                <h2 className="text-2xl font-bold text-slate-800">My Reports</h2>
                <div className="bg-slate-100 p-2 rounded-lg">
                    <Filter className="w-5 h-5 text-slate-500" />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'In Progress', 'Resolved'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p>No reports found.</p>
                    </div>
                ) : (
                    filteredReports.map((report) => (
                        <div
                            key={report.id}
                            onClick={() => onNavigate('report-details', report.id)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${report.type === 'Pothole' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {report.type}
                                </span>
                                {report.status === 'Resolved' ? (
                                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> In Progress
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                {report.image && (
                                    <img src={report.image} alt="Report" className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
                                )}
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800 mb-1">{report.location}</p>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-2">{report.description || `Reported ${report.type} issue.`}</p>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {report.timestamp}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyReports;
