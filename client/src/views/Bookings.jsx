import React, { useState } from 'react';
import { Search, Calendar, DollarSign, Users, Check, X, Clock, ChevronRight, User, Car, CreditCard, AlertCircle } from 'lucide-react';

const Bookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const bookingsData = [
    {
      id: '#VT-9021',
      customer: 'Sophia Hayes',
      vehicle: 'Tesla Model S',
      duration: 'Mar 15 - Mar 18, 2024',
      amount: 450,
      status: 'ACTIVE',
      image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=300&h=200&fit=crop',
      email: 'sophia.h@email.com',
      phone: '+1 (555) 123-4567',
      pickupDate: 'Mar 15, 2024 10:00 AM',
      returnDate: 'Mar 18, 2024 10:00 AM',
      subtotal: 400,
      taxes: 40,
      insurance: 50,
      securityDeposit: 200
    },
    {
      id: '#VT-9020',
      customer: 'Michael Chen',
      vehicle: 'BMW X5',
      duration: 'Mar 14 - Mar 16, 2024',
      amount: 380,
      status: 'PENDING',
      image: 'https://images.unsplash.com/photo-1616788494707-ee7b62e27b67?w=300&h=200&fit=crop',
      email: 'm.chen@email.com',
      phone: '+1 (555) 987-6543',
      pickupDate: 'Mar 14, 2024 2:00 PM',
      returnDate: 'Mar 16, 2024 2:00 PM',
      subtotal: 350,
      taxes: 30,
      insurance: 45,
      securityDeposit: 200
    },
    {
      id: '#VT-9019',
      customer: 'Emma Wilson',
      vehicle: 'Mercedes C-Class',
      duration: 'Mar 10 - Mar 12, 2024',
      amount: 320,
      status: 'COMPLETED',
      image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=300&h=200&fit=crop',
      email: 'emma.w@email.com',
      phone: '+1 (555) 456-7890',
      pickupDate: 'Mar 10, 2024 9:00 AM',
      returnDate: 'Mar 12, 2024 9:00 AM',
      subtotal: 280,
      taxes: 25,
      insurance: 40,
      securityDeposit: 150
    },
    {
      id: '#VT-9018',
      customer: 'James Rodriguez',
      vehicle: 'Audi A4',
      duration: 'Mar 8 - Mar 10, 2024',
      amount: 280,
      status: 'CANCELLED',
      image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=300&h=200&fit=crop',
      email: 'j.rodriguez@email.com',
      phone: '+1 (555) 321-9876',
      pickupDate: 'Mar 8, 2024 11:00 AM',
      returnDate: 'Mar 10, 2024 11:00 AM',
      subtotal: 250,
      taxes: 20,
      insurance: 35,
      securityDeposit: 150
    },
    {
      id: '#VT-9017',
      customer: 'Olivia Brown',
      vehicle: 'Toyota Camry',
      duration: 'Mar 5 - Mar 7, 2024',
      amount: 220,
      status: 'REFUNDED',
      image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=300&h=200&fit=crop',
      email: 'olivia.b@email.com',
      phone: '+1 (555) 654-3210',
      pickupDate: 'Mar 5, 2024 1:00 PM',
      returnDate: 'Mar 7, 2024 1:00 PM',
      subtotal: 200,
      taxes: 15,
      insurance: 25,
      securityDeposit: 100
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-50 text-green-600 border-green-200';
      case 'PENDING': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'COMPLETED': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-200';
      case 'REFUNDED': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const summaryCards = [
    { title: 'Total Active', value: '1,284', icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Approval', value: '42', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Check-ins Today', value: '18', icon: Calendar, color: 'bg-green-500' }
  ];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 ${selectedBooking ? 'mr-96' : ''} transition-all duration-300`}>
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search bookings, customers, vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
          <p className="text-gray-600">Manage and monitor all vehicle rental bookings</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon size={24} className="text-white" />
                </div>
                <span className="text-sm text-gray-500">This month</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
              <p className="text-sm text-gray-600">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Vehicle</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Duration</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingsData.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-gray-900 font-medium">{booking.customer}</p>
                        <p className="text-xs text-gray-500">{booking.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900">{booking.vehicle}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600">{booking.duration}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900 font-medium">NPR {booking.amount}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {booking.status === 'PENDING' && (
                        <button 
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle confirm action
                          }}
                        >
                          CONFIRM
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Selected Booking Panel */}
      {selectedBooking && (
        <div className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">SELECTED BOOKING</h2>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Vehicle Details */}
            <div className="mb-6">
              <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                <img 
                  src={selectedBooking.image} 
                  alt={selectedBooking.vehicle}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedBooking.vehicle}</h3>
              <p className="text-sm text-gray-500">{selectedBooking.id}</p>
            </div>

            {/* Customer Details */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">CUSTOMER DETAILS</h4>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{selectedBooking.customer}</p>
                <p className="text-sm text-gray-600">{selectedBooking.email}</p>
                <p className="text-sm text-gray-600">{selectedBooking.phone}</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  <User size={14} />
                  VIEW PROFILE
                </button>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">BOOKING TIMELINE</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Pickup</p>
                    <p className="text-xs text-gray-500">{selectedBooking.pickupDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Return</p>
                    <p className="text-xs text-gray-500">{selectedBooking.returnDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">FINANCIAL BREAKDOWN</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">NPR {selectedBooking.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="text-gray-900">NPR {selectedBooking.taxes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Insurance Premium</span>
                  <span className="text-gray-900">NPR {selectedBooking.insurance}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">NPR {selectedBooking.amount}</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Security Deposit</span>
                    <span className="text-blue-600">NPR {selectedBooking.securityDeposit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                CANCEL
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                UPDATE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
