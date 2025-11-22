import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = ({ children, currentView, onNavigate }) => {
    return (
        <div className="min-h-screen bg-slate-100 md:flex md:justify-center md:items-center md:p-4 font-sans">
            <div className="w-full h-screen md:max-w-md bg-slate-50 md:h-[850px] md:max-h-[90vh] md:shadow-2xl md:rounded-[3rem] relative flex flex-col overflow-hidden md:border-8 md:border-slate-900">
                <Header />
                <main className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
                    {children}
                </main>
                <BottomNav currentView={currentView} onNavigate={onNavigate} />
            </div>
        </div>
    );
};

export default Layout;


