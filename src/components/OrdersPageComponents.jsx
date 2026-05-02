import React from 'react';
import '../css/orders.css';

export const OrdersList = () => {
    // Dummy data for now
    const dummyOrders = [
        {
            id: 'ORD-12345678',
            userName: 'John Doe',
            phoneNumber: '+1 234 567 8900',
            vehicleName: 'Tesla Model S',
            licenseId: 'LIC-987654',
            pickupDate: '2026-05-10',
            returnDate: '2026-05-15',
            totalPrice: '15000',
            status: 'Confirmed'
        }
    ];

    return (
        <div className="orders-container">
            <h1 className="orders-title">My Orders</h1>
            {dummyOrders.length > 0 ? (
                <div className="orders-list">
                    {dummyOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Order {order.id}</span>
                                <span className="order-status">{order.status}</span>
                            </div>
                            <div className="order-details">
                                <div className="detail-item">
                                    <span className="detail-label">User Name</span>
                                    <span className="detail-value">{order.userName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone Number</span>
                                    <span className="detail-value">{order.phoneNumber}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Vehicle Name</span>
                                    <span className="detail-value">{order.vehicleName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">License ID</span>
                                    <span className="detail-value">{order.licenseId}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Pickup Date</span>
                                    <span className="detail-value">{order.pickupDate}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Return Date</span>
                                    <span className="detail-value">{order.returnDate}</span>
                                </div>
                            </div>
                            <div className="order-footer">
                                <span className="order-total">Total Price: NPR {order.totalPrice}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};
