import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import defaultCarImg from '../assets/images/4wheeler.png';
import defaultBikeImg from '../assets/images/2wheeler.png';
import defaultEvImg from '../assets/images/ev.png';
import bmwX7Img from '../assets/images/bmw_x7_1774791305841.png';
import bulletBikeImg from '../assets/images/bullet_bike_1774791285776.png';
import teslaModelSImg from '../assets/images/tesla_model_s_1774791127857.png';
import '../css/orders.css';

const getVehicleImage = (vehicle = {}) => {
    if (vehicle.image_url) return vehicle.image_url;

    const vehicleText = `${vehicle.brand || ''} ${vehicle.name || ''} ${vehicle.vehicle_type || ''} ${vehicle.fuel_type || ''}`.toLowerCase();

    if (vehicleText.includes('tesla') || vehicleText.includes('model s')) return teslaModelSImg;
    if (vehicleText.includes('bmw') || vehicleText.includes('x7')) return bmwX7Img;
    if (
        vehicleText.includes('bullet') ||
        vehicleText.includes('royal enfield') ||
        vehicleText.includes('yamaha') ||
        vehicleText.includes('bike') ||
        vehicleText.includes('2 wheeler')
    ) {
        return bulletBikeImg || defaultBikeImg;
    }
    if (vehicleText.includes('electric') || vehicleText.includes('ev')) return defaultEvImg;

    return defaultCarImg;
};

export const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            const { data, error } = await supabase
                .from('bookings')
                .select('*, vehicles(name, brand, image_url, vehicle_type, fuel_type)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading orders...</div>;

    return (
        <div className="orders-container">
            <h1 className="orders-title">My Orders</h1>
            {orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Order #{order.id}</span>
                                <span className="order-status">{order.status}</span>
                            </div>
                            <div className="order-content">
                                <div className="order-vehicle-image">
                                    <img
                                        src={getVehicleImage(order.vehicles)}
                                        alt={order.vehicles?.name || 'Booked vehicle'}
                                        onError={(e) => {
                                            e.currentTarget.src = order.vehicles?.vehicle_type === '2 Wheeler' ? defaultBikeImg : defaultCarImg;
                                        }}
                                    />
                                </div>
                                <div className="order-info">
                                    <div className="order-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Name</span>
                                            <span className="detail-value">{order.full_name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Phone</span>
                                            <span className="detail-value">{order.phone}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Vehicle</span>
                                            <span className="detail-value">{order.vehicles?.name || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Pickup Date</span>
                                            <span className="detail-value">{order.pickup_date}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Return Date</span>
                                            <span className="detail-value">{order.return_date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-footer">
                                <span className="order-total">Total: NPR {Number(order.total_price).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: "center", marginTop: "60px", color: "#718096" }}>
                    No orders found. <a href="/listing">Book a vehicle</a>
                </p>
            )}
        </div>
    );
};
