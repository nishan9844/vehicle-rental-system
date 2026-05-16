import React, { useState, useEffect } from 'react';
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
import { Link, useSearchParams } from 'react-router-dom';

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
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All Brands');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
    const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    
    // Additional filter states
    const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'all');
    const [vehicleType, setVehicleType] = useState(searchParams.get('type') || 'all');
    const [availability, setAvailability] = useState(searchParams.get('availability') || 'all');

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedBrand !== 'All Brands') params.set('brand', selectedBrand);
        if (selectedCategory !== 'All Categories') params.set('category', selectedCategory);
        if (currentPage > 1) params.set('page', currentPage);
        if (priceRange !== 'all') params.set('priceRange', priceRange);
        if (vehicleType !== 'all') params.set('type', vehicleType);
        if (availability !== 'all') params.set('availability', availability);
        
        const filtered = vehicles.filter(vehicle => {
            const matchesSearch = !searchTerm || 
                vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehicle.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBrand = selectedBrand === 'All Brands' || vehicle.brand === selectedBrand;
            const matchesCategory = selectedCategory === 'All Categories' || vehicle.category === selectedCategory;
            
            // Price range filter
            const matchesPriceRange = priceRange === 'all' || (
                priceRange === '0-500' && parseFloat(vehicle.price.replace('NPR ', '')) <= 500 ||
                priceRange === '500-1000' && parseFloat(vehicle.price.replace('NPR ', '')) > 500 && parseFloat(vehicle.price.replace('NPR ', '')) <= 1000 ||
                priceRange === '1000+' && parseFloat(vehicle.price.replace('NPR ', '')) > 1000
            );
            
            // Vehicle type filter
            const matchesVehicleType = vehicleType === 'all' || vehicle.type === vehicleType;
            
            // Availability filter
            const matchesAvailability = availability === 'all' || (
                availability === 'available' && vehicle.status === 'AVAILABLE' ||
                availability === 'unavailable' && vehicle.status === 'IN RENTAL' ||
                availability === 'maintenance' && vehicle.status === 'MAINTENANCE'
            );
            
            return matchesSearch && matchesBrand && matchesCategory && matchesPriceRange && matchesVehicleType && matchesAvailability;
        });
        
        setFilteredVehicles(filtered);
    }, [searchTerm, selectedBrand, selectedCategory, currentPage, priceRange, vehicleType, availability]);

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);
    
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 text-xs"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <select 
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="bg-gray-50 border border-gray-200 pl-3 pr-8 py-2 text-xs rounded-lg appearance-none cursor-pointer text-gray-600"
                            >
                                <option>All Brands</option>
                                <option>Tesla</option>
                                <option>Porsche</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-gray-50 border border-gray-200 pl-3 pr-8 py-2 text-xs rounded-lg appearance-none cursor-pointer text-gray-600"
                            >
                                <option>All Categories</option>
                                <option>Suv</option>
                                <option>Sedan</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative">
                            <select 
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="bg-gray-50 border border-gray-200 pl-3 pr-8 py-2 text-xs rounded-lg appearance-none cursor-pointer text-gray-600"
                            >
                                <option value="all">All Prices</option>
                                <option value="0-500">NPR 0-500</option>
                                <option value="500-1000">NPR 500-1000</option>
                                <option value="1000+">NPR 1000+</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative">
                            <select 
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="bg-gray-50 border border-gray-200 pl-3 pr-8 py-2 text-xs rounded-lg appearance-none cursor-pointer text-gray-600"
                            >
                                <option value="all">All Types</option>
                                <option value="Electric">Electric</option>
                                <option value="Gasoline">Gasoline</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative">
                            <select 
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                className="bg-gray-50 border border-gray-200 pl-3 pr-8 py-2 text-xs rounded-lg appearance-none cursor-pointer text-gray-600"
                            >
                                <option value="all">All Status</option>
                                <option value="available">Available</option>
                                <option value="unavailable">Unavailable</option>
                                <option value="maintenance">Maintenance</option>
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
                            {paginatedVehicles.map((v) => (
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
                    <p className="text-xs text-gray-500 font-medium">Showing <span className="text-gray-900">{startIndex + 1} to {Math.min(endIndex, filteredVehicles.length)}</span> of {filteredVehicles.length} vehicles</p>
                    <div className="flex gap-1">
                        <button 
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            const isActive = pageNumber === currentPage;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageClick(pageNumber)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                        isActive 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                    disabled={pageNumber > totalPages}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                        {currentPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
                        <button 
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
