import React, { useState } from 'react';
import { Search, Download, Filter, TrendingUp, CreditCard, Wallet, AlertCircle, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Methods');
  const [dateFilter, setDateFilter] = useState('Last 30 Days');

  const paymentsData = [
    {
      id: 'PAY-001',
      customer: 'John Shrestha',
      method: 'Visa',
      methodIcon: CreditCard,
      amount: 45000,
      status: 'PAID',
      date: '2024-03-15 14:30:00',
      cardLast4: '4242'
    },
    {
      id: 'PAY-002',
      customer: 'Anjali Karki',
      method: 'eSewa',
      methodIcon: Wallet,
      amount: 32000,
      status: 'PENDING',
      date: '2024-03-15 13:45:00',
      transactionId: 'ESW123456789'
    },
    {
      id: 'PAY-003',
      customer: 'Ramesh Thapa',
      method: 'Khalti',
      methodIcon: Wallet,
      amount: 28000,
      status: 'FAILED',
      date: '2024-03-15 12:20:00',
      transactionId: 'KHT987654321'
    },
    {
      id: 'PAY-004',
      customer: 'Sita Gurung',
      method: 'Mastercard',
      methodIcon: CreditCard,
      amount: 52000,
      status: 'PAID',
      date: '2024-03-15 11:15:00',
      cardLast4: '8888'
    },
    {
      id: 'PAY-005',
      customer: 'Bikram Lama',
      method: 'eSewa',
      methodIcon: Wallet,
      amount: 15000,
      status: 'REFUNDED',
      date: '2024-03-15 10:30:00',
      transactionId: 'ESW456789123'
    },
    {
      id: 'PAY-006',
      customer: 'Priya Sharma',
      method: 'Visa',
      methodIcon: CreditCard,
      amount: 38000,
      status: 'PAID',
      date: '2024-03-15 09:45:00',
      cardLast4: '1234'
    },
    {
      id: 'PAY-007',
      customer: 'Amit Singh',
      method: 'Khalti',
      methodIcon: Wallet,
      amount: 42000,
      status: 'PENDING',
      date: '2024-03-15 08:20:00',
      transactionId: 'KHT654321987'
    },
    {
      id: 'PAY-008',
      customer: 'Maya Kumari',
      method: 'Mastercard',
      methodIcon: CreditCard,
      amount: 25000,
      status: 'PAID',
      date: '2024-03-15 07:10:00',
      cardLast4: '5678'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return { color: 'bg-green-50 text-green-600 border-green-200', icon: CheckCircle };
      case 'PENDING':
        return { color: 'bg-yellow-50 text-yellow-600 border-yellow-200', icon: Clock };
      case 'FAILED':
        return { color: 'bg-red-50 text-red-600 border-red-200', icon: XCircle };
      case 'REFUNDED':
        return { color: 'bg-purple-50 text-purple-600 border-purple-200', icon: RefreshCw };
      default:
        return { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: AlertCircle };
    }
  };

  const getMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'visa':
      case 'mastercard':
        return CreditCard;
      case 'esewa':
      case 'khalti':
        return Wallet;
      default:
        return CreditCard;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const summaryCards = [
    { 
      title: 'Total Revenue', 
      value: '1,245,600.00', 
      change: '+12.5%', 
      icon: TrendingUp, 
      color: 'bg-green-500',
      prefix: 'NPR '
    },
    { 
      title: 'Pending Deposits', 
      value: '84,200.00', 
      action: 'Reconcile Now', 
      icon: Clock, 
      color: 'bg-yellow-500',
      prefix: 'NPR '
    },
    { 
      title: 'Weekly Refunds', 
      value: '12,500.00', 
      subtitle: 'This Week', 
      icon: RefreshCw, 
      color: 'bg-red-500',
      prefix: 'NPR '
    }
  ];

  const tabs = ['All Methods', 'Card', 'eSewa', 'Khalti'];
  const dateFilters = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year'];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments Management</h1>
          <p className="text-gray-600">Monitor and manage all payment transactions</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
              {card.change && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">{card.change}</span>
                </div>
              )}
              {card.subtitle && (
                <span className="text-xs text-gray-500">{card.subtitle}</span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.prefix}{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
            {card.action && (
              <button className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-medium">
                {card.action}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Tabs and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search and Date Filter */}
            <div className="flex gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search transactions, IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  {dateFilters.map((filter) => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-sm font-medium text-gray-600">CUSTOMER</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">METHOD</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">AMOUNT</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">STATUS</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">DATE & TIME</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map((payment) => {
                const statusBadge = getStatusBadge(payment.status);
                const StatusIcon = statusBadge.icon;
                const MethodIcon = getMethodIcon(payment.method);
                
                return (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-gray-900 font-medium">{payment.customer}</p>
                        <p className="text-xs text-gray-500">{payment.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MethodIcon size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm">{payment.method}</p>
                          <p className="text-xs text-gray-500">
                            {payment.cardLast4 ? `•••• ${payment.cardLast4}` : payment.transactionId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900 font-medium">{formatAmount(payment.amount)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon size={14} className={statusBadge.color.replace('bg-', 'text-').replace('/10', '').replace(' border-', ' ')} />
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-gray-500">{formatDate(payment.date)}</p>
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
              Showing 1 to 10 of 245 entries
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">2</button>
              <button className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">3</button>
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

export default Payments;
