import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    BookOpen,
    Users,
    CreditCard,
    HelpCircle,
    LogOut,
    Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../contexts/AuthContext';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Car, label: 'Vehicles', path: '/vehicles' },
    { icon: BookOpen, label: 'Bookings', path: '/bookings' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login', { replace: true });
    }

    return (
        <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-200 sticky top-0 shrink-0">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    V
                </div>
                <span className="text-gray-900 font-bold text-xl tracking-tight">VENTAL</span>
            </div>

            <nav className="flex-1 mt-4 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 mb-6 space-y-2">
                <Link
                    to="/rentals/new"
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 group transition-all duration-200 hover:text-white"
                >
                    <Plus size={20} />
                    <span className="font-medium group-hover:text-white">New Rental</span>
                </Link>

                <div className="pt-4 mt-4 border-t border-gray-200">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors">
                        <HelpCircle size={20} />
                        <span className="font-medium">Support</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;