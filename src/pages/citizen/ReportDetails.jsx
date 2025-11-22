import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, AlertTriangle, CheckCircle, User, FileText, Shield, ChevronRight, Activity, AlertCircle, Camera, Lock, ThumbsUp, ThumbsDown, Users } from 'lucide-react';

import { useCivic } from '../../context/CivicContext';

const ReportDetails = ({ reportId, onBack }) => {
    const { reports, incrementScore, voteReport } = useCivic();
    const [hasValidated, setHasValidated] = useState(false);
    const [userVote, setUserVote] = useState(null); // 'real' or 'fake'

    // Find the report or use a fallback if not found (shouldn't happen normally)
    const foundReport = reports.find(r => r.id === reportId) || reports[0];

    // Generate deterministic mock data based on report ID to keep it consistent but distinct
    const generateMockDetails = (report) => {
        const idNum = typeof report.id === 'number' ? report.id : parseInt(report.id.replace(/\D/g, '')) || 1;
        const isEven = idNum % 2 === 0;

        return {
            id: `C00${report.id}`,
            title: report.type ? `${report.type} Issue` : 'Civic Issue',
            location: report.location,
            description: report.description || `Reported ${report.type} issue at this location causing inconvenience to public.`,
            severity: isEven ? 'High' : 'Medium',
            status: report.status,
            image: report.image,
            validationCount: report.votes || Math.floor(Math.random() * 20) + 8, // Use real votes if available
            realVotes: report.votes ? Math.floor(report.votes * 0.8) : Math.floor(Math.random() * 15) + 5, // Mock distribution
            fakeVotes: report.votes ? Math.floor(report.votes * 0.2) : Math.floor(Math.random() * 5) + 1, // Mock distribution
            sla: {
                level: isEven ? 2 : 1,
                role: isEven ? 'BBMP AEE – East Zone' : 'BBMP Ward Engineer – Ward 112',
                remainingHours: isEven ? 33 : 12,
                totalHours: isEven ? 48 : 24,
                startTime: report.timestamp,
                deadline: '2 Days remaining',
                escalationReason: isEven ? 'Level 1 (Ward Engineer) failed to resolve within 24h.' : null,
                nextEscalation: isEven ? 'Zonal Commissioner (East)' : 'BBMP AEE (Level 2)'
            },
            timeline: [
                { id: 1, type: 'citizen', title: 'Complaint Reported', time: report.timestamp, icon: User, status: 'done', detail: 'Reported by Citizen' },
                { id: 2, type: 'system', title: 'Assigned to Level 1', time: 'Just now', icon: Shield, status: 'done', detail: 'BBMP Ward Engineer Assigned' },
                ...(isEven ? [
                    { id: 3, type: 'system', title: 'SLA Breach – Level 1', time: 'Yesterday', icon: AlertTriangle, status: 'breach', detail: 'Failed to act within 24h' },
                    { id: 4, type: 'system', title: 'Escalated to Level 2', time: 'Today', icon: Activity, status: 'active', detail: 'Auto-escalated by System' }
                ] : [])
            ],
            escalationPath: [
                { level: 1, role: 'BBMP Ward Engineer', sla: '24h', status: isEven ? 'breached' : 'active', timeSpent: isEven ? '24h' : '2h' },
                { level: 2, role: 'BBMP AEE', sla: '48h', status: isEven ? 'active' : 'pending', timeSpent: isEven ? '15h' : '-' },
                { level: 3, role: 'Zonal Commissioner', sla: '72h', status: 'pending', timeSpent: '-' },
            ]
        };
    };


    const report = generateMockDetails(foundReport);

    const handleVote = async (type) => {
        const success = await voteReport(foundReport.id, type);
        if (success) {
            setHasValidated(true);
            setUserVote(type);
            incrementScore(5);
            alert(`Voted as ${type === 'up' ? 'Real' : 'Fake'}! +5 Points`);
        } else {
            alert("Failed to submit vote. Please try again.");
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* 1. Header */}
            <div className="relative h-64">
                <img src={report.image} alt="Complaint" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-mono mb-2 border border-white/10">
                                ID: {report.id}
                            </span>
                            <h1 className="text-2xl font-bold leading-tight mb-1">{report.title}</h1>
                            <div className="flex items-center gap-1 text-slate-200 text-sm">
                                <MapPin className="w-4 h-4" /> {report.location}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6 -mt-6 relative z-10">
                {/* 2. Complaint Summary Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wide">
                            {report.severity} Severity
                        </span>
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                            <Activity className="w-3 h-3" /> {report.status}
                        </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {report.description}
                    </p>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                            <p className="text-xs text-slate-400 uppercase font-bold">Category</p>
                            <p className="text-slate-700 font-semibold text-sm">Sanitation</p>
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                            <p className="text-xs text-slate-400 uppercase font-bold">Filed</p>
                            <p className="text-slate-700 font-semibold text-sm">20 Nov</p>
                        </div>
                    </div>
                </div>

                {/* 3. SLA Countdown Section */}
                <div className="bg-teal-900 rounded-2xl p-5 text-white shadow-lg shadow-teal-900/20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Clock className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-teal-200 text-xs font-bold uppercase tracking-wider border border-teal-700 px-2 py-1 rounded">
                                Active SLA: Level {report.sla.level}
                            </span>
                            <span className="text-teal-200 text-xs">Deadline: {report.sla.deadline}</span>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-4xl font-bold mb-1">{report.sla.remainingHours}h <span className="text-lg font-normal text-teal-300">remaining</span></h3>
                            <div className="w-full bg-teal-800/50 h-2 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="bg-teal-400 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${(report.sla.remainingHours / report.sla.totalHours) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-teal-800/50 rounded-xl p-3 border border-teal-700/50">
                                <p className="text-teal-300 text-xs uppercase font-bold mb-1">Currently Assigned To</p>
                                <div className="flex items-center gap-2">
                                    <div className="bg-teal-700 p-1.5 rounded-full">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <p className="font-semibold text-sm">{report.sla.role}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 text-xs text-teal-200 bg-teal-800/30 p-2 rounded-lg">
                                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                                <p>
                                    <span className="font-bold text-amber-400">Why Escalated?</span> {report.sla.escalationReason}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Accountability Ledger */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-slate-400" /> Accountability Ledger
                    </h3>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {report.timeline.map((event) => (
                                <div key={event.id} className="relative pl-10">
                                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 ${event.status === 'breach' ? 'bg-rose-100 text-rose-600' :
                                        event.status === 'active' ? 'bg-blue-100 text-blue-600' :
                                            'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        <event.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${event.status === 'breach' ? 'text-rose-600' : 'text-slate-800'}`}>
                                            {event.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{event.detail}</p>
                                        <p className="text-xs text-slate-400 font-mono mt-1">{event.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Future Steps / Requirements */}
                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span>Officer Acknowledgement</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                                    <Camera className="w-4 h-4" />
                                </div>
                                <span>Proof of Work (Photo/Video)</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <span>Citizen Confirmation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Escalation History */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Escalation Path</h3>
                    <div className="space-y-3">
                        {report.escalationPath.map((level) => (
                            <div key={level.level} className={`p-4 rounded-xl border flex justify-between items-center ${level.status === 'active' ? 'bg-blue-50 border-blue-200 shadow-sm' :
                                level.status === 'breached' ? 'bg-rose-50 border-rose-100 opacity-70' :
                                    'bg-white border-slate-100 opacity-50'
                                }`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${level.status === 'active' ? 'bg-blue-200 text-blue-800' :
                                            level.status === 'breached' ? 'bg-rose-200 text-rose-800' :
                                                'bg-slate-200 text-slate-600'
                                            }`}>
                                            L{level.level}
                                        </span>
                                        <span className="font-semibold text-slate-800 text-sm">{level.role}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">SLA Target: {level.sla}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${level.status === 'active' ? 'text-blue-600' :
                                        level.status === 'breached' ? 'text-rose-600' :
                                            'text-slate-400'
                                        }`}>
                                        {level.timeSpent}
                                    </p>
                                    <p className="text-xs text-slate-400 uppercase">Time Spent</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Community Validation Section */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Community Validation
                    </h3>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        {/* Validation Stats */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">{report.validationCount}</p>
                                    <p className="text-xs text-slate-500">Total Validations</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="text-center">
                                    <div className="flex items-center gap-1 justify-center mb-1">
                                        <ThumbsUp className="w-4 h-4 text-emerald-600" />
                                        <p className="text-xl font-bold text-emerald-600">{report.realVotes}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-500 uppercase">Real</p>
                                </div>
                                <div className="h-10 w-px bg-slate-200" />
                                <div className="text-center">
                                    <div className="flex items-center gap-1 justify-center mb-1">
                                        <ThumbsDown className="w-4 h-4 text-rose-600" />
                                        <p className="text-xl font-bold text-rose-600">{report.fakeVotes}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-500 uppercase">Fake</p>
                                </div>
                            </div>
                        </div>

                        {/* Validation Actions */}
                        {hasValidated ? (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <p className="font-semibold text-blue-800">You've validated this report!</p>
                                <p className="text-sm text-blue-600 mt-1">
                                    You voted: <span className="font-bold capitalize">{userVote === 'up' ? 'Real' : 'Fake'}</span>
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-slate-600 mb-3 text-center font-medium">
                                    Help the community by validating this report
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleVote('up')}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 hover:border-emerald-300 transition-all active:scale-95"
                                    >
                                        <ThumbsUp className="w-5 h-5" /> Vote Real
                                    </button>
                                    <button
                                        onClick={() => handleVote('down')}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 hover:border-rose-300 transition-all active:scale-95"
                                    >
                                        <ThumbsDown className="w-5 h-5" /> Vote Fake
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
