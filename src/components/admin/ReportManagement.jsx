import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, AlertCircle, CheckCircle, Clock, Image as ImageIcon } from 'lucide-react';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/reports', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setReports(data);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (reportId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/reports/${reportId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchReports();
                setSelectedReport(null);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'In Progress': return <AlertCircle className="w-4 h-4" />;
            case 'Resolved': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const filteredReports = reports.filter(report => {
        if (filter === 'all') return true;
        return report.status === filter;
    });

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <h1 className="text-3xl font-bold text-gray-900">Issue Management</h1>
                <p className="text-gray-500 mt-1">View and manage all reported issues</p>

                {/* Filters */}
                <div className="flex gap-3 mt-4">
                    {['all', 'Pending', 'In Progress', 'Resolved'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'all' ? 'All Issues' : status}
                            {status !== 'all' && (
                                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {reports.filter(r => r.status === status).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Loading reports...</div>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-3" />
                        <p>No reports found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredReports.map(report => (
                            <div
                                key={report.id}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedReport(report)}
                            >
                                <div className="flex items-start justify-between">
                                    {/* Left side */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(report.status)}`}>
                                                {getStatusIcon(report.status)}
                                                {report.status}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900 bg-purple-100 px-3 py-1 rounded-full">
                                                {report.category}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {report.title}
                                        </h3>

                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {report.description}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{report.location || report.area || 'Unknown Location'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{report.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(report.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side - Image */}
                                    {report.image && (
                                        <div className="ml-4 flex-shrink-0">
                                            <img
                                                src={report.image}
                                                alt={report.title}
                                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReport(null)}>
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedReport.title}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(selectedReport.status)}`}>
                                            {getStatusIcon(selectedReport.status)}
                                            {selectedReport.status}
                                        </span>
                                        <span className="text-sm text-gray-500">ID: #{selectedReport.id}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="px-8 py-6">
                            {/* Image */}
                            {selectedReport.image && (
                                <div className="mb-6">
                                    <img
                                        src={selectedReport.image}
                                        alt={selectedReport.title}
                                        className="w-full h-96 object-cover rounded-xl border-2 border-gray-200"
                                    />
                                </div>
                            )}

                            {/* Details */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Description</h3>
                                    <p className="text-gray-800">{selectedReport.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Category</h3>
                                        <p className="text-gray-800 font-medium">{selectedReport.category}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Location</h3>
                                        <p className="text-gray-800">{selectedReport.location || selectedReport.area}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Reported By</h3>
                                        <p className="text-gray-800">{selectedReport.author}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Date</h3>
                                        <p className="text-gray-800">{new Date(selectedReport.date).toLocaleString()}</p>
                                    </div>
                                </div>

                                {selectedReport.ward && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Ward / Zone</h3>
                                        <p className="text-gray-800">{selectedReport.ward} / {selectedReport.zone}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Update Status</h3>
                                <div className="flex gap-3">
                                    {['Pending', 'In Progress', 'Resolved'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => updateStatus(selectedReport.id, status)}
                                            disabled={selectedReport.status === status}
                                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${selectedReport.status === status
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : status === 'Resolved'
                                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                                        : status === 'In Progress'
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;
