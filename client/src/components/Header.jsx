import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ title }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    return (
        <header className="h-20 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 w-full">
            <div className="flex items-center flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Vehicles, bookings, or customers..."
                        className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-2.5 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative">
                    <div 
                        className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {user?.name || 'Nishan'}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                                {user?.role || 'Administrator'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-gray-300 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <ChevronDown 
                            size={16} 
                            className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            
                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <User size={16} />
                                Profile
                            </button>
                            
                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <Settings size={16} />
                                Settings
                            </button>
                            
                            <div className="border-t border-gray-100 my-2"></div>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
