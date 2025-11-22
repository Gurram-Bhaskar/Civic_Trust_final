import React from 'react';
import HeatMapWidget from '../../components/HeatMapWidget';

const MapPage = () => {
    return (
        <div className="p-4 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">City Heat Map</h2>
            <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative">
                <HeatMapWidget />
                {/* Overlay to make it look like a full page map */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm text-xs font-bold text-slate-600">
                    Live Updates
                </div>
            </div>
        </div>
    );
};

export default MapPage;
