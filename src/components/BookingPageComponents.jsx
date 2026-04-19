import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCircleCheck, LuInfo, LuArrowRight } from "react-icons/lu";
import { Link } from "react-router-dom";

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
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 20);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        licenseId: "",
        deposit: "NPR 500", // Keep as static recommendation or read-only
        phone: "",
        documentation: "",
        pickupDate: "",
        returnDate: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Booking Details Submitted (POST):", formData);
        alert("Booking details processed! Redirecting to payment...");
        navigate("/payment");
    };

    return (
        <div className="booking-layout">
            <main className="booking-main">
                {/* Vehicle Selection Card */}
                <div className="booking-card">
                    <h2 className="card-title">Vehicle Selection</h2>
                    <div className="vehicle-select-flex">
                        <img
                            src={teslaImg}
                            alt="Vehicle"
                            className="booking-vehicle-img"
                            style={{ width: "240px", height: "160px", objectFit: "cover", borderRadius: "16px" }}
                        />
                        <div className="vehicle-select-info">
                            <h3 className="vehicle-name">Velocity GT-S 2024</h3>
                            <p className="vehicle-sub-details">
                                Automatic • 4.0L V8 • 2-Seater
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
                                <input type="text" name="licenseId" className="form-control" placeholder="eg. A123-4567-8900" value={formData.licenseId} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Security Deposit</label>
                                <input type="text" name="deposit" className="form-control" value={formData.deposit} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Pickup Date</label>
                                <input type="date" name="pickupDate" className="form-control" min={today} max={maxDateStr} value={formData.pickupDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Return Date</label>
                                <input type="date" name="returnDate" className="form-control" min={formData.pickupDate || today} max={maxDateStr} value={formData.returnDate} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" name="phone" className="form-control" placeholder="eg. +977 98XXXXXX" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Documentation Verification</label>
                                <input type="text" name="documentation" className="form-control" placeholder="eg. National ID, Citizenship" value={formData.documentation} onChange={handleChange} required />
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
                            <span>Daily Rate (3 days)</span>
                            <strong className="summary-price">NPR 299.00 / day</strong>
                        </div>
                        <div className="summary-item">
                            <span>Subtotal</span>
                            <strong className="summary-price">NPR 897.00</strong>
                        </div>
                        <div className="summary-item">
                            <span>Taxes & Fees (15%)</span>
                            <strong className="summary-price">NPR 134.55</strong>
                        </div>
                        <div className="summary-item">
                            <span>Luxury Surcharge</span>
                            <strong className="summary-price">NPR 50.00</strong>
                        </div>
                        <div className="summary-item">
                            <span>Security Deposit</span>
                            <strong className="summary-price">NPR 500</strong>
                        </div>
                    </div>

                    <div className="total-row">
                        <span className="total-label">TOTAL PRICE</span>
                        <div className="total-amount">NPR 1,081.55</div>
                    </div>

                    <div className="legal-notice-box">
                        <p className="legal-text">
                            By clicking "Confirm Booking", you agree to our Rental Agreement and Privacy Policy.
                            Your credit card will be authorized for a NPR 500 security deposit.
                        </p>
                    </div>

                    <button
                        type="submit"
                        form="bookingForm"
                        className="btn-confirm"
                    >
                        Confirm Booking <LuArrowRight style={{ width: "18px", marginLeft: "8px" }} />
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
