import React from 'react';
import { Map } from 'lucide-react';

const HeatMapWidget = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Map className="w-4 h-4 text-blue-500" /> Issue Heatmap
                </h3>
                <span className="text-xs text-slate-400">Live Updates</span>
            </div>
            <div className="relative h-48 bg-slate-100 w-full overflow-hidden group cursor-pointer">
                {/* Mock Map Background */}
                <div className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}>
                </div>

                {/* Heat Spots */}
                <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-red-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-amber-500 rounded-full blur-xl opacity-50"></div>
                <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-red-600 rounded-full blur-2xl opacity-30 animate-pulse delay-75"></div>

                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                    <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm text-slate-700">
                        View Full Map
                    </span>
                </div>
            </div>
            <div className="p-3 bg-slate-50 text-xs text-center text-slate-500">
                High activity reported in <span className="font-semibold text-slate-700">Downtown</span> area.
            </div>
        </div>
    );
};

export default HeatMapWidget;
