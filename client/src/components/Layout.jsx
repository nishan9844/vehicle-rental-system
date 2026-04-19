import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();

    // Custom titles based on route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Executive Summary';
            case '/vehicles': return 'Fleet Overview';
            case '/vehicles/add': return 'Add New Vehicle';
            case '/bookings': return 'Booking Management';
            case '/customers': return 'Customer Directory';
            default: return 'Fleet Management';
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header title={getPageTitle()} />
                <main className="p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
