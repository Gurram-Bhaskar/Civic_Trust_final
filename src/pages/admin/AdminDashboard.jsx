import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, TrendingUp, Users, BarChart3, Download, Plus, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'issues', name: 'Issue Management', icon: FileText, badge: stats?.pendingIssues || 0 },
        { id: 'ward', name: 'Ward Performance', icon: TrendingUp },
        { id: 'contractors', name: 'Contractors', icon: Users },
        { id: 'analytics', name: 'Predictive Analytics', icon: BarChart3 }
    ];

    const getStatsCards = () => {
        if (!stats) return [];

        return [
            {
                title: 'Total Complaints',
                value: stats.totalComplaints.toLocaleString(),
                subtitle: 'This month',
                trend: '+12.5%',
                positive: true,
                icon: '📋',
                color: 'blue'
            },
            {
                title: 'Resolved Issues',
                value: stats.resolvedIssues.toLocaleString(),
                subtitle: `Resolution rate: ${stats.resolutionRate}%`,
                trend: '+8.3%',
                positive: true,
                icon: '✅',
                color: 'green'
            },
            {
                title: 'Pending Issues',
                value: stats.pendingIssues.toLocaleString(),
                subtitle: 'Average wait: 3.2 days',
                trend: '-5.2%',
                positive: true,
                icon: '⏱️',
                color: 'yellow'
            },
            {
                title: 'SLA Compliance',
                value: `${stats.slaCompliance}%`,
                subtitle: 'Target: 90%',
                trend: '+2.1%',
                positive: true,
                icon: '🎯',
                color: 'purple'
            },
            {
                title: 'Active Contractors',
                value: stats.activeContractors.toString(),
                subtitle: 'Working on projects',
                trend: '+4',
                positive: true,
                icon: '👥',
                color: 'indigo'
            },
            {
                title: 'Budget Utilization',
                value: `₹${(stats.budget.utilized / 10000000).toFixed(1)}Cr`,
                subtitle: `Of ₹${(stats.budget.allocated / 10000000).toFixed(1)}Cr allocated`,
                percentage: `${stats.budget.percentage}%`,
                icon: '💰',
                color: 'teal'
            }
        ];
    };

    const quickActions = [
        {
            title: 'Assign Bulk Issues',
            description: 'Assign multiple pending issues to contractors',
            icon: '🔀',
            color: 'blue'
        },
        {
            title: 'Generate Report',
            description: 'Create monthly performance report',
            icon: '📄',
            color: 'green'
        },
        {
            title: 'Process Payments',
            description: 'Review and approve contractor payments',
            icon: '💳',
            color: 'purple'
        },
        {
            title: 'Emergency Alert',
            description: 'Send urgent notifications to field teams',
            icon: '⚠️',
            color: 'red'
        }
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Comprehensive municipal operations management and oversight</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            Export Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Plus className="w-4 h-4" />
                            New Action
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mt-6">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors relative ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{tab.name}</span>
                                {tab.badge !== undefined && tab.badge > 0 && (
                                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Admin Info Banner */}
                {stats?.adminInfo && (
                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <span className="text-xl">👤</span>
                                    {stats.adminInfo.name}
                                    <span className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                                        {stats.adminInfo.level}
                                    </span>
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Jurisdiction:</span>{' '}
                                    {stats.adminInfo.level === 'L1' && `${stats.adminInfo.assignedArea} Ward`}
                                    {stats.adminInfo.level === 'L2' && `Zone ${stats.adminInfo.assignedZone}`}
                                    {stats.adminInfo.level === 'L3' && 'City-wide (All Zones)'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Data visible for</p>
                                <p className="font-semibold text-blue-700">
                                    {stats.adminInfo.level === 'L1' && 'Ward Level'}
                                    {stats.adminInfo.level === 'L2' && 'Zone Level'}
                                    {stats.adminInfo.level === 'L3' && 'City Level'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                ) : (
                    <div className="flex gap-6">
                        {/* Main Content - Stats Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                {getStatsCards().map((stat, index) => (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100 text-2xl`}>
                                                {stat.icon}
                                            </div>
                                            {stat.trend && (
                                                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                                                    ↗ {stat.trend}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                        <div className="text-sm font-medium text-gray-900 mb-1">{stat.title}</div>
                                        <div className="text-sm text-gray-500">{stat.subtitle}</div>
                                        {stat.percentage && (
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                    <span>{stat.percentage}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className={`bg-${stat.color}-600 h-2 rounded-full`} style={{ width: stat.percentage }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions Sidebar */}
                        <div className="w-80">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${action.color}-100 text-xl flex-shrink-0`}>
                                                {action.icon}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 mb-1">{action.title}</div>
                                                <div className="text-xs text-gray-500">{action.description}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
