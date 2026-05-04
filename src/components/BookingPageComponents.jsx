import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { LuCircleCheck, LuArrowRight } from "react-icons/lu";
import { supabase } from "../supabaseClient";

// Import images
import teslaImg from "../assets/images/tesla_model_s_1774791127857.png";

export function BookingHeader() {
    return (
        <header className="page-header">
            <h1>Complete Your Reservation</h1>
            <p className="description-text">
                Secure your performance vehicle with our streamlined booking process.
                Your journey into kinetic luxury begins here.
            </p>
        </header>
    );
}

export function BookingContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const initialPickup = queryParams.get("pickup") || "";
    const initialReturn = queryParams.get("return") || "";

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 20);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        licenseId: "",
        phone: "",
        documentation: "",
        pickupDate: initialPickup,
        returnDate: initialReturn
    });

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        const fetchVehicle = async () => {
            const { data } = await supabase.from('vehicles').select('*').eq('id', id).single();
            if (data) setVehicle(data);
            setLoading(false);
        };
        fetchVehicle();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'phone') {
            formattedValue = value.replace(/\D/g, '').slice(0, 10);
        } else if (name === 'licenseId') {
            const numbers = value.replace(/\D/g, '').slice(0, 12);
            if (numbers.length > 4) {
                formattedValue = `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4)}`;
            } else if (numbers.length > 2) {
                formattedValue = `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
            } else {
                formattedValue = numbers;
            }
        } else if (name === 'documentation') {
            const numbers = value.replace(/\D/g, '').slice(0, 11);
            if (numbers.length > 6) {
                formattedValue = `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6)}`;
            } else if (numbers.length > 4) {
                formattedValue = `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4)}`;
            } else if (numbers.length > 2) {
                formattedValue = `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
            } else {
                formattedValue = numbers;
            }
        }

        setFormData({ ...formData, [name]: formattedValue });
    };

    // Date diff calculation
    const getDays = () => {
        if (!formData.pickupDate || !formData.returnDate) return 0;
        const start = new Date(formData.pickupDate);
        const end = new Date(formData.returnDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1; // at least 1 day if same date
    };

    const days = getDays() || 1;
    const dailyRate = vehicle?.price_per_day || 299;
    const subtotal = days * dailyRate;
    const taxes = subtotal * 0.15;
    const deposit = 500;
    const total = subtotal + taxes + deposit;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const bookingData = {
                user_id: user?.id || null,
                vehicle_id: id || null,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                license_id: formData.licenseId,
                documentation: formData.documentation,
                pickup_date: formData.pickupDate,
                return_date: formData.returnDate,
                total_price: total,
                deposit: deposit,
                status: 'pending'
            };

            // Pass the held booking data to the payment page via navigation state
            console.log("Holding booking data in local state:", bookingData);
            navigate('/payment', { state: { bookingData, vehicle } });
            
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred.");
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>;

    const displayVehicle = vehicle || {
        name: "Velocity GT-S 2024",
        transmission: "Automatic",
        seats: 2,
        price_per_day: 299,
        image_url: teslaImg
    };

    return (
        <div className="booking-layout">
            <main className="booking-main">
                {/* Vehicle Selection Card */}
                <div className="booking-card">
                    <h2 className="card-title">Vehicle Selection</h2>
                    <div className="vehicle-select-flex">
                        <img
                            src={displayVehicle.image_url || teslaImg}
                            alt={displayVehicle.name}
                            className="booking-vehicle-img"
                            style={{ width: "240px", height: "160px", objectFit: "cover", borderRadius: "16px" }}
                        />
                        <div className="vehicle-select-info">
                            <h3 className="vehicle-name">{displayVehicle.name}</h3>
                            <p className="vehicle-sub-details">
                                {displayVehicle.transmission} • {displayVehicle.seats} Seats
                            </p>
                            <ul className="benefits-list">
                                <li>
                                    <LuCircleCheck className="text-primary" />
                                    <span className="feature-highlight">Insurance Included</span>
                                </li>
                                <li>
                                    <LuCircleCheck className="text-primary" />
                                    <span className="feature-highlight">Unlimited Kilometers</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Personal Details Card */}
                <div className="booking-card" style={{ marginTop: "40px" }}>
                    <h2 className="card-title">Personal Details</h2>
                    <form id="bookingForm" className="booking-form" onSubmit={handleSubmit} method="POST">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="fullName" className="form-control" placeholder="eg. Julian Vane" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" className="form-control" placeholder="eg. vane@velocity.club" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Driver's License ID</label>
                                <input type="text" name="licenseId" className="form-control" placeholder="eg. 12-34-56789012" value={formData.licenseId} onChange={handleChange} pattern="\d{2}-\d{2}-\d{8}" title="Format: xx-xx-xxxxxxxx" required />
                            </div>
                            <div className="form-group">
                                <label>Security Deposit</label>
                                <input type="text" name="deposit" className="form-control" value={`NPR ${deposit}`} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Pickup Date</label>
                                <input type="date" name="pickupDate" className="form-control" min={today} max={maxDateStr} value={formData.pickupDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Return Date</label>
                                <input 
                                    type="date" 
                                    name="returnDate" 
                                    className="form-control" 
                                    min={formData.pickupDate ? new Date(new Date(formData.pickupDate).getTime() + 86400000).toISOString().split('T')[0] : tomorrow} 
                                    max={maxDateStr} 
                                    value={formData.returnDate} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" name="phone" className="form-control" placeholder="eg. 9800000000" value={formData.phone} onChange={handleChange} pattern="\d{10}" title="Must be exactly 10 digits" required />
                            </div>
                            <div className="form-group">
                                <label>Documentation Verification (Citizenship)</label>
                                <input type="text" name="documentation" className="form-control" placeholder="eg. 12-34-56-78901" value={formData.documentation} onChange={handleChange} pattern="\d{2}-\d{2}-\d{2}-\d{5}" title="Format: xx-xx-xx-xxxxx" required />
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            {/* Booking Summary Side */}
            <aside className="booking-sidebar">
                <div className="booking-card sticky-sidebar">
                    <h2 className="card-title">Booking Summary</h2>

                    <div className="summary-rows">
                        <div className="summary-item">
                            <span>Daily Rate ({getDays() || 1} days)</span>
                            <strong className="summary-price">NPR {dailyRate.toFixed(2)} / day</strong>
                        </div>
                        <div className="summary-item">
                            <span>Subtotal</span>
                            <strong className="summary-price">NPR {subtotal.toFixed(2)}</strong>
                        </div>
                        <div className="summary-item">
                            <span>Taxes & Fees (15%)</span>
                            <strong className="summary-price">NPR {taxes.toFixed(2)}</strong>
                        </div>
                        <div className="summary-item">
                            <span>Security Deposit</span>
                            <strong className="summary-price">NPR {deposit.toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="total-row">
                        <span className="total-label">TOTAL PRICE</span>
                        <div className="total-amount">NPR {total.toFixed(2)}</div>
                    </div>

                    <div className="legal-notice-box">
                        <p className="legal-text">
                            By clicking "Confirm Booking", you agree to our Rental Agreement and Privacy Policy.
                            Your credit card will be authorized for a NPR {deposit} security deposit.
                        </p>
                    </div>

                    <button
                        type="submit"
                        form="bookingForm"
                        className="btn-confirm"
                        disabled={submitting}
                    >
                        {submitting ? 'Processing...' : 'Confirm Booking'} <LuArrowRight style={{ width: "18px", marginLeft: "8px" }} />
                    </button>
                </div>
            </aside>
        </div>
    );
}

export default function BookingPageComponents() {
    return (
        <>
            <BookingHeader />
            <BookingContent />
        </>
    );
}
