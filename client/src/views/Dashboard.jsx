import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    Car,
    Calendar,
    Users,
    Wallet,
    ArrowRight,
    Zap,
    Clock,
    CheckCircle2,
    FileText,
    Star,
    ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import StatCard from '../components/StatCard';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const revenueData = [
    { name: 'JAN', value: 400 },
    { name: 'FEB', value: 300 },
    { name: 'MAR', value: 600 },
    { name: 'APR', value: 450 },
    { name: 'MAY', value: 500 },
    { name: 'JUN', value: 350 },
    { name: 'JUL', value: 550 },
];

const Dashboard = () => {
    console.log('Dashboard: Component mounting');
    const [selectedInterval, setSelectedInterval] = useState('Monthly');
    
    // Data sets for different time intervals
    const revenueData = {
        'Monthly': [
            { name: 'JAN', value: 45000 },
            { name: 'FEB', value: 52000 },
            { name: 'MAR', value: 48000 },
            { name: 'APR', value: 61000 },
            { name: 'MAY', value: 55000 },
            { name: 'JUN', value: 58000 },
            { name: 'JUL', value: 62000 }
        ],
        'Weekly': [
            { name: 'Week 1', value: 12500 },
            { name: 'Week 2', value: 14800 },
            { name: 'Week 3', value: 11200 },
            { name: 'Week 4', value: 16800 }
        ],
        'Daily': [
            { name: 'Mon', value: 2100 },
            { name: 'Tue', value: 2450 },
            { name: 'Wed', value: 1890 },
            { name: 'Thu', value: 3200 },
            { name: 'Fri', value: 2800 },
            { name: 'Sat', value: 1650 },
            { name: 'Sun', value: 980 }
        ]
    };
    
    const currentData = revenueData[selectedInterval];
    
    console.log('Dashboard: Rendering dashboard with interval:', selectedInterval);
    
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Executive Summary</h1>
                    <p className="text-gray-600 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        Download Report
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                        Add Vehicle
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Vehicles"
                    value="1,482"
                    trend="up"
                    trendValue="+12%"
                    icon={Car}
                    iconBg="bg-blue-600/20 text-blue-400"
                    subValue="163 Available"
                />
                <StatCard
                    title="Active Bookings"
                    value="145"
                    trend="up"
                    trendValue="+4%"
                    icon={Calendar}
                    iconBg="bg-purple-600/20 text-purple-400"
                    subValue="8 upcoming pickups today"
                />
                <StatCard
                    title="Total Customers"
                    value="8,924"
                    trend="up"
                    trendValue="+243"
                    icon={Users}
                    iconBg="bg-indigo-600/20 text-indigo-400"
                    subValue="12 pending verification"
                />
                <StatCard
                    title="Total Revenue"
                    value="NPR 1,245k"
                    trend="up"
                    trendValue="+18%"
                    icon={Wallet}
                    iconBg="bg-emerald-600/20 text-emerald-400"
                    subValue="28 pending payments"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Overview */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                            <p className="text-xs text-gray-500">Comparative analysis of rental earnings.</p>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {['Monthly', 'Weekly', 'Daily'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedInterval(tab)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedInterval === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="99%" height="100%">
                            <BarChart data={currentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(59,130,246,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: '#1a1a1a'
                                    }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {currentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 2 ? '#0f467e' : '#e2e8f0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Booking Flow */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Flow</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Today's Bookings", count: 42, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Upcoming Returns", count: 18, icon: ArrowRight, color: "text-emerald-600", bg: "bg-emerald-50", rotate: -45 },
                            { label: "Upcoming Pickups", count: 26, icon: ArrowRight, color: "text-blue-600", bg: "bg-blue-50", rotate: 45 },
                            { label: "Cancelled", count: 4, icon: Clock, color: "text-red-600", bg: "bg-red-50" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                                        <item.icon size={20} style={item.rotate ? { transform: `rotate(${item.rotate}deg)` } : {}} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{item.label}</p>
                                        <p className="text-xl font-bold text-gray-900">{item.count}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Vehicle Distribution */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Vehicle Distribution</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
                                <Zap className="text-emerald-600" size={24} />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">214</p>
                                    <p className="text-[10px] font-bold uppercase text-gray-500">EV Vehicle</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
                                <Car className="text-blue-600" size={24} />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">842</p>
                                    <p className="text-[10px] font-bold uppercase text-gray-500">4-Wheelers</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
                            <div className="flex items-center gap-3">
                                <Car className="text-indigo-600" size={24} />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">426</p>
                                    <p className="text-[10px] font-bold uppercase text-gray-500">2-Wheelers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Activities */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Live Activities</h3>
                        <button className="text-blue-500 text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { type: 'booking', user: 'Rajesh M.', ref: '#BK-10294', detail: 'Mahindra Scorpio', time: '2 mins ago', icon: Calendar, iconBg: 'bg-blue-500/10 text-blue-500' },
                            { type: 'payment', user: 'Payment confirmed for #BK-90210', detail: 'TXN_00293 • NPR 12,500', time: '15 mins ago', icon: CheckCircle2, iconBg: 'bg-emerald-500/10 text-emerald-500' },
                            { type: 'vehicle', user: 'New vehicle added: Tesla Model Y', detail: 'EV Premium • VIN: ...X092J', time: '1 hour ago', icon: Car, iconBg: 'bg-purple-500/10 text-purple-500' },
                            { type: 'document', user: 'Document submitted by Priya K.', detail: "Driver's License verification pending review.", time: '3 hours ago', icon: FileText, iconBg: 'bg-orange-500/10 text-orange-500' },
                            { type: 'review', user: 'Review posted by Aayush', detail: 'Excellent service and the car was in perfect condition...', time: 'Yesterday', icon: Star, iconBg: 'bg-indigo-500/10 text-indigo-500', star: 5 },
                        ].map((activity, idx) => (
                            <div key={idx} className="flex gap-4 group">
                                <div className="relative">
                                    <div className={cn("p-2 rounded-lg relative z-10", activity.iconBg)}>
                                        <activity.icon size={16} />
                                    </div>
                                    {idx !== 4 && <div className="absolute top-8 bottom-[-24px] left-1/2 w-[1px] bg-white/5 -translate-x-1/2"></div>}
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {activity.type === 'booking' ? (
                                                    <>New booking created by <span className="text-blue-400">{activity.user}</span></>
                                                ) : activity.user}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{activity.detail}</p>
                                            {activity.star && (
                                                <div className="flex gap-0.5 mt-2">
                                                    {[...Array(activity.star)].map((_, i) => <Star key={i} size={10} className="fill-orange-400 text-orange-400" />)}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
