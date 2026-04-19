import React from 'react';
import {
    Search,
    ChevronDown,
    Filter,
    Plus,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const vehicles = [
    {
        id: 1,
        name: "Model S Plaid",
        brand: "Tesla",
        type: "Electric",
        category: "Luxury Sedan",
        seats: 5,
        price: "NPR 199.00",
        status: "AVAILABLE",
        image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Cayenne Turbo",
        brand: "Porsche",
        type: "Gasoline",
        category: "Performance SUV",
        seats: 5,
        price: "NPR 245.00",
        status: "IN RENTAL",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "i7 xDrive60",
        brand: "BMW",
        type: "Electric",
        category: "Executive Sedan",
        seats: 5,
        price: "NPR 310.00",
        status: "MAINTENANCE",
        image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Range Rover Sport",
        brand: "Land Rover",
        type: "Hybrid",
        category: "Luxury SUV",
        seats: 7,
        price: "NPR 275.00",
        status: "AVAILABLE",
        image: "https://images.unsplash.com/photo-1549399386-66e8eaa4a9a8?w=400&h=300&fit=crop"
    }
];

const Inventory = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex justify-between items-center bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wider mb-2">
                        <button className="text-gray-900 border-b-2 border-blue-600 pb-1">Fleet Overview</button>
                        <button className="text-gray-600 hover:text-gray-900">Reports</button>
                        <button className="text-gray-600 hover:text-gray-900">Logs</button>
                        <button className="text-gray-600 hover:text-gray-900">Analytics</button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600 text-sm mt-1">Oversee your entire luxury Vehicle fleet. Track availability, maintenance, and rental pricing.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                        Quick Export
                    </button>
                    <Link to="/vehicles/add" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                        <Plus size={18} />
                        Add Vehicle
                    </Link>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by Model, category, P/D..."
                            className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 text-xs"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <select className="bg-gray-50 border border-gray-200 pl-3 pr-8 py-2 text-xs rounded-lg appearance-none cursor-pointer text-gray-600">
                                <option>All Brands</option>
                                <option>Tesla</option>
                                <option>Porsche</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative">
                            <select className="bg-gray-50 border border-gray-200 pl-3 pr-8 py-2 text-xs rounded-lg appearance-none cursor-pointer text-gray-600">
                                <option>All Categories</option>
                                <option>Suv</option>
                                <option>Sedan</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-600">Preview</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-600">Vehicle Details</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-600">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-600">Seats</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-600">Price/Day</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-600">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {vehicles.map((v) => (
                                <tr key={v.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="w-20 aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{v.name}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{v.brand} • {v.type}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600 font-medium">{v.category}</td>
                                    <td className="px-6 py-4 text-xs text-gray-600 font-bold">{v.seats}</td>
                                    <td className="px-6 py-4 text-xs text-blue-600 font-bold">{v.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[9px] font-bold tracking-wider",
                                            v.status === 'AVAILABLE' ? "bg-emerald-50 text-emerald-600" :
                                                v.status === 'IN RENTAL' ? "bg-orange-50 text-orange-600" :
                                                    "bg-blue-50 text-blue-600"
                                        )}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">Showing <span className="text-gray-900">1 to 4</span> of 128 vehicles</p>
                    <div className="flex gap-1">
                        <button className="p-1.5 text-gray-600 hover:text-gray-900"><ChevronLeft size={16} /></button>
                        <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">1</button>
                        <button className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-bold">2</button>
                        <button className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-bold">3</button>
                        <span className="px-2 text-gray-500">...</span>
                        <button className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-bold">32</button>
                        <button className="p-1.5 text-gray-600 hover:text-gray-900"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
