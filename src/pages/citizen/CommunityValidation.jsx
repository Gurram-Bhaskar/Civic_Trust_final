import React from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Check, MapPin, Navigation, Camera, Users, Eye, Search } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

const CommunityValidation = ({ onBack, onNavigate }) => {
    const { reports, incrementScore, voteReport, verifyFix } = useCivic();
    const [activeTab, setActiveTab] = React.useState('fix'); // 'fix' or 'report'
    const [validatedReports, setValidatedReports] = React.useState(new Set()); // Track validated reports locally for UI feedback
    const [searchQuery, setSearchQuery] = React.useState('');

    const [userLocation, setUserLocation] = React.useState('Locating...');

    React.useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, we'd reverse geocode this.
                    // For prototype, we'll display coordinates or a generic "Current Location"
                    // to show it's working dynamically.
                    const { latitude, longitude } = position.coords;
                    setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setUserLocation('Location Unavailable');
                }
            );
        } else {
            setUserLocation('Geolocation not supported');
        }
    }, []);

    // Helper to calculate distance between two coords (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return (d * 0.621371).toFixed(1); // Convert to miles
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const getReportDistance = (reportLoc) => {
        if (userLocation === 'Locating...' || userLocation === 'Location Unavailable' || userLocation === 'Geolocation not supported') {
            return (Math.random() * 2 + 0.5).toFixed(1); // Fallback mock
        }

        // Check if report location is coords
        const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
        const reportMatch = reportLoc.match(coordRegex);
        const userMatch = userLocation.match(coordRegex);

        if (reportMatch && userMatch) {
            const [_, rLat, __, rLon] = reportMatch;
            const [___, uLat, ____, uLon] = userMatch;
            return calculateDistance(parseFloat(uLat), parseFloat(uLon), parseFloat(rLat), parseFloat(rLon));
        }

        return (Math.random() * 2 + 0.5).toFixed(1); // Fallback for address-based locations
    };

    // Filter and process reports
    const processReports = (statusFilter) => {
        return reports
            .filter(r => statusFilter(r.status))
            .filter(r =>
                searchQuery === '' ||
                r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.type.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(r => ({
                ...r,
                distance: getReportDistance(r.location),
                validationCount: r.votes || Math.floor(Math.random() * 15) + 3
            }))
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)); // Sort by nearest
    };

    const fixVerifications = processReports(status => status === 'Fixed - Verification Needed');
    const newReports = processReports(status => status === 'Pending Validation' || status === 'In Progress');

    const displayedReports = activeTab === 'fix' ? fixVerifications : newReports;

    const handleVerifyFix = async (id, isFixed, event) => {
        event.stopPropagation(); // Prevent card click

        if (validatedReports.has(id)) {
            alert("You've already validated this report!");
            return;
        }

        const success = await verifyFix(id, isFixed);
        if (success) {
            incrementScore(20); // Higher points for verifying fixes
            setValidatedReports(prev => new Set([...prev, id]));
            alert(isFixed ? "Fix Verified! +20 Points" : "Reported as Not Fixed. +5 Points");
        } else {
            alert("Failed to verify fix. Please try again.");
        }
    };

    const handleVote = async (id, type, event) => {
        event.stopPropagation(); // Prevent card click

        if (validatedReports.has(id)) {
            alert("You've already validated this report!");
            return;
        }

        const success = await voteReport(id, type);
        if (success) {
            incrementScore(5);
            setValidatedReports(prev => new Set([...prev, id]));
            alert(`Vote ${type} recorded! +5 Points`);
        } else {
            alert("Failed to submit vote. Please try again.");
        }
    };

    const handleReportClick = (reportId) => {
        // Navigate to report details
        onNavigate('report-details', reportId);
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

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Community Validation</h2>
                <p className="text-slate-500">Earn points by verifying reports and fixes.</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('fix')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'fix' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Verify Fixes (Proof-of-Fix)
                </button>
                <button
                    onClick={() => setActiveTab('report')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'report' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Validate Reports
                </button>
            </div>

            {/* User Location Context */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Navigation className="w-5 h-5 text-blue-600 fill-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Your Location</p>
                        <p className="font-semibold text-slate-700">{userLocation}</p>
                    </div>
                </div>

                {/* Search/Filter Area */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search area (e.g. 'Koramangala') or issue..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {displayedReports.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                        <Check className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                        <p className="text-slate-600 font-medium">All caught up!</p>
                        <p className="text-slate-400 text-sm">No items need validation in this category.</p>
                    </div>
                ) : (
                    displayedReports.map((report) => {
                        const hasValidated = validatedReports.has(report.id);

                        return (
                            <div
                                key={report.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleReportClick(report.id)}
                            >
                                <div className="relative">
                                    <img src={report.image} alt="Report" className="w-full h-48 object-cover" />
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {report.distance} miles away
                                    </div>
                                    {activeTab === 'fix' && (
                                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
                                            Official Marked Fixed
                                        </div>
                                    )}
                                    {hasValidated && (
                                        <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Validated
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                            {report.type}
                                        </span>
                                        <span className="text-xs text-slate-400">{report.timestamp}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1">{report.location}</h3>
                                    <p className="text-slate-600 text-sm mb-3">{report.description || (activeTab === 'fix' ? "Official claims this is fixed. Can you verify?" : "Is this issue real? Help us verify.")}</p>

                                    {/* Validation Count */}
                                    <div className="flex items-center gap-2 mb-4 text-sm">
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <Users className="w-4 h-4" />
                                            <span className="font-semibold">{report.validationCount}</span>
                                            <span className="text-slate-400">validations</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-blue-600 ml-auto">
                                            <Eye className="w-4 h-4" />
                                            <span className="text-xs font-medium">Click to view details</span>
                                        </div>
                                    </div>

                                    {activeTab === 'fix' ? (
                                        <div className="space-y-3">
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
                                                <p className="font-semibold mb-1">Proof Required:</p>
                                                <p>Please take a photo of the fixed area to close this ticket.</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleVerifyFix(report.id, true, e)}
                                                    disabled={hasValidated}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${hasValidated
                                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                                        : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
                                                        }`}
                                                >
                                                    <Camera className="w-5 h-5" /> {hasValidated ? 'Already Verified' : 'Verify Fix'}
                                                </button>
                                                <button
                                                    onClick={(e) => handleVerifyFix(report.id, false, e)}
                                                    disabled={hasValidated}
                                                    className={`px-4 py-3 rounded-xl border font-bold transition-colors ${hasValidated
                                                        ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                                        : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                                        }`}
                                                >
                                                    Not Fixed
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => handleVote(report.id, 'up', e)}
                                                disabled={hasValidated}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border font-medium transition-colors ${hasValidated
                                                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    }`}
                                            >
                                                <ThumbsUp className="w-4 h-4" /> {hasValidated ? 'Validated' : 'Real'}
                                            </button>
                                            <button
                                                onClick={(e) => handleVote(report.id, 'down', e)}
                                                disabled={hasValidated}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border font-medium transition-colors ${hasValidated
                                                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                                    : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                    }`}
                                            >
                                                <ThumbsDown className="w-4 h-4" /> {hasValidated ? 'Validated' : 'Fake'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CommunityValidation;
