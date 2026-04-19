import React, { useState } from 'react';
import { Search, Download, Plus, Filter, ChevronDown, User, Mail, Phone, CheckCircle, AlertTriangle, XCircle, TrendingUp, Users, Clock, Star } from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Most Bookings');

  const customersData = [
    {
      id: 'CUST-001',
      name: 'Arjun K. Shrestha',
      email: 'arjun.s@outlook.com',
      phone: '+977-9841-0000xx',
      verification: 'LICENSED',
      licenseNumber: 'NP-99-0021',
      bookings: 24,
      revenue: 142500,
      status: 'ACTIVE',
      joinDate: 'June 2023',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'CUST-002',
      name: 'Priya Adhikari',
      email: 'priya.a@gmail.com',
      phone: '+977-9810-000XXX',
      verification: 'PENDING DOC',
      licenseNumber: 'L-1901-22-XXXX',
      bookings: 0,
      revenue: 0,
      status: 'PENDING',
      joinDate: 'January 2024',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'CUST-003',
      name: 'Ramesh Basnet',
      email: 'ramesh.b@nepal.np',
      phone: '+977-9851-XXXxxxx',
      verification: 'SUSPICIOUS',
      licenseNumber: 'ID Verification Failed',
      bookings: 12,
      revenue: 84200,
      status: 'BLOCKED',
      joinDate: 'August 2022',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'CUST-004',
      name: 'Sita Sharma',
      email: 'sita.s@gmail.com',
      phone: '+977-9842-123456',
      verification: 'LICENSED',
      licenseNumber: 'NP-99-0156',
      bookings: 18,
      revenue: 98700,
      status: 'ACTIVE',
      joinDate: 'March 2023',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'CUST-005',
      name: 'Bikram Gurung',
      email: 'bikram.g@outlook.com',
      phone: '+977-9855-987654',
      verification: 'LICENSED',
      licenseNumber: 'NP-99-0234',
      bookings: 31,
      revenue: 178900,
      status: 'ACTIVE',
      joinDate: 'December 2022',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const getVerificationBadge = (verification) => {
    switch (verification) {
      case 'LICENSED':
        return { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle };
      case 'PENDING DOC':
        return { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Clock };
      case 'SUSPICIOUS':
        return { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertTriangle };
      default:
        return { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: XCircle };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'BLOCKED':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const summaryCards = [
    { 
      title: 'Total Customers', 
      value: '12,840', 
      change: '+12%', 
      icon: Users, 
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      title: 'Active Drivers', 
      value: '8,922', 
      change: '+4.5%', 
      icon: CheckCircle, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Pending Verification', 
      value: '156', 
      change: 'High Priority', 
      icon: Clock, 
      color: 'bg-yellow-500',
      trend: 'priority'
    },
    { 
      title: 'New Members This Week', 
      value: '245', 
      change: 'New', 
      icon: Star, 
      color: 'bg-purple-500',
      trend: 'new'
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers Management</h1>
          <p className="text-gray-600">Directory &gt; Active User Base</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export List
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add New Customer
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
              {card.trend === 'up' && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">{card.change}</span>
                </div>
              )}
              {card.trend === 'priority' && (
                <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full border border-yellow-200">
                  {card.change}
                </span>
              )}
              {card.trend === 'new' && (
                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full border border-purple-200">
                  {card.change}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 px-4 py-3 pr-10 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="All">Status: All</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Blocked">Blocked</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 px-4 py-3 pr-10 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="Most Bookings">Sort: Most Bookings</option>
                  <option value="Newest">Newest First</option>
                  <option value="Revenue">Highest Revenue</option>
                  <option value="Name">Name A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-sm font-medium text-gray-600">FULL NAME</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">EMAIL / PHONE</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">VERIFICATION</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">BOOKINGS</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer) => {
                const verificationBadge = getVerificationBadge(customer.verification);
                const VerificationIcon = verificationBadge.icon;
                
                return (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={customer.avatar} 
                            alt={customer.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{customer.name}</p>
                          <p className="text-xs text-gray-500">Joined {customer.joinDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <p className="text-sm text-gray-600">{customer.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <p className="text-sm text-gray-600">{customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <VerificationIcon size={14} className={verificationBadge.color.replace('bg-', 'text-').replace('/10', '').replace(' border-', ' ')} />
                        <div>
                          <p className={`px-2 py-1 rounded-full text-xs font-medium border ${verificationBadge.color}`}>
                            {customer.verification}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{customer.licenseNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-gray-900 font-medium">{customer.bookings} Rides</p>
                        <p className="text-sm text-gray-500">NPR {customer.revenue.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing 1-10 of 12,840 customers
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">2</button>
              <button className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">3</button>
              <span className="px-2 text-slate-600">...</span>
              <button className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">128</button>
              <button className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
