import React from "react";
import { 
    LuStar, LuBattery, LuUsers, LuTimer, LuZap, 
    LuUser, LuCircleCheck, LuCalendar 
} from "react-icons/lu";
import { Link } from "react-router-dom";

// Import images
import teslaImg from "../assets/images/tesla_model_s_1774791127857.png";

export function DetailsHero() {
    return (
        <section className="details-hero">
            <div className="container">
                <div className="breadcrumb">
                    <Link to="/listing">Vehicles</Link> / <span>Tesla Model S</span>
                </div>
                
                <div className="details-layout">
                    <div className="details-gallery">
                        <div className="gallery-main">
                            <img src={teslaImg} alt="Tesla Model S" />
                        </div>
                        <div className="gallery-thumbs">
                            <div className="thumb active"><img src={teslaImg} /></div>
                            <div className="thumb"><img src={teslaImg} /></div>
                            <div className="thumb"><img src={teslaImg} /></div>
                        </div>
                    </div>

                    <div className="details-sidebar">
                        <div className="vehicle-header">
                            <div className="fleet-tag" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                                <LuStar style={{ width: "14px", fill: "currentColor" }} /> TOP RATED FLEET
                            </div>
                            <h1 className="vehicle-title">Velocity Sapphire EV</h1>
                            <div className="vehicle-price">
                                <span className="price-amount">NPR 499</span>
                                <span className="price-suffix">/ day</span>
                            </div>
                        </div>

                        <div className="specs-grid">
                            <div className="spec-card">
                                <div className="spec-icon"><LuBattery /></div>
                                <div className="spec-info">
                                    <span className="spec-label">Range</span>
                                    <span className="spec-value">520 mi</span>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="spec-icon"><LuUsers /></div>
                                <div className="spec-info">
                                    <span className="spec-label">Seats</span>
                                    <span className="spec-value">4 Adults</span>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="spec-icon"><LuTimer /></div>
                                <div className="spec-info">
                                    <span className="spec-label">0-60 mph</span>
                                    <span className="spec-value">2.1s</span>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="spec-icon"><LuZap /></div>
                                <div className="spec-info">
                                    <span className="spec-label">Drivetrain</span>
                                    <span className="spec-value">AWD Dual</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function DetailsContent() {
    return (
        <div className="details-content-layout container">
            <div className="details-main-text">
                <section className="info-section">
                    <h2>Mastery in Motion</h2>
                    <p>
                        The Azure Velocity Sapphire Edition redefines the electric grand touring experience. 
                        Engineered with a triple-motor powertrain, it delivers instantaneous torque and unparalleled precision. 
                        The cabin is a sanctuary of sustainable luxury, featuring recycled ocean plastic textiles 
                        and ethically sourced open-pore wood.
                    </p>
                </section>

                <section className="reviews-section">
                    <h2>Guest Experiences</h2>
                    <div className="rating-overview">
                        <div className="rating-number">
                            <span>4.9</span>
                            <div className="t-stars" style={{ margin: "14px 0" }}>
                                <LuStar className="star filled" />
                                <LuStar className="star filled" />
                                <LuStar className="star filled" />
                                <LuStar className="star filled" />
                                <LuStar className="star filled" />
                            </div>
                            <div className="rating-count">Based on 128 reviews</div>
                        </div>
                        <div className="rating-bars">
                            <div className="bar-row">
                                <span className="bar-label">5 stars</span>
                                <div className="bar"><div className="fill" style={{ width: "92%" }}></div></div>
                                <span className="bar-pct">92%</span>
                            </div>
                            <div className="bar-row">
                                <span className="bar-label">4 stars</span>
                                <div className="bar"><div className="fill" style={{ width: "6%" }}></div></div>
                                <span className="bar-pct">6%</span>
                            </div>
                            <div className="bar-row">
                                <span className="bar-label">3 stars</span>
                                <div className="bar"><div className="fill" style={{ width: "2%" }}></div></div>
                                <span className="bar-pct">2%</span>
                            </div>
                            <div className="bar-row">
                                <span className="bar-label">2 stars</span>
                                <div className="bar"><div className="fill" style={{ width: "0%" }}></div></div>
                                <span className="bar-pct">0%</span>
                            </div>
                            <div className="bar-row">
                                <span className="bar-label">1 star</span>
                                <div className="bar"><div className="fill" style={{ width: "0%" }}></div></div>
                                <span className="bar-pct">0%</span>
                            </div>
                        </div>
                    </div>

                    <div className="review-list">
                        <div className="review-item">
                            <div className="review-header">
                                <div className="t-user">
                                    <div className="t-avatar"><LuUser /></div>
                                    <div className="t-info">
                                        <span className="review-user-name">Julianna Mercer</span>
                                        <span className="review-date">October 12, 2024</span>
                                    </div>
                                </div>
                                <div className="verified-badge">
                                    <LuCircleCheck style={{ width: "16px" }} /> VERIFIED RENTER
                                </div>
                            </div>
                            <div className="t-stars" style={{ margin: "12px 0" }}>
                                <LuStar className="star filled" style={{ width: "12px" }} />
                                <LuStar className="star filled" style={{ width: "12px" }} />
                                <LuStar className="star filled" style={{ width: "12px" }} />
                                <LuStar className="star filled" style={{ width: "12px" }} />
                                <LuStar className="star filled" style={{ width: "12px" }} />
                            </div>
                            <p className="review-body">
                                The Velocity Sapphire is beyond anything I've driven. The acceleration is pin-sharp, 
                                but it's the interior quietness that really shocked me. Azure Velocity made the 
                                pickup process seamless at LAX. Definitely the highlight of my trip.
                            </p>
                        </div>
                    </div>
                    
                    <button className="btn btn-outline btn-block" style={{ borderStyle: "dashed", marginTop: "24px" }}>
                        View More Reviews
                    </button>
                </section>
            </div>

            <div className="details-booking-widget">
                <div className="booking-card">
                    <h3>Availability</h3>
                    
                    <div className="date-picker-group">
                        <label className="spec-label">PICKUP DATE</label>
                        <div className="date-input">
                            <input type="text" defaultValue="Oct 24, 2024" readOnly />
                            <LuCalendar />
                        </div>
                    </div>

                    <div className="date-picker-group">
                        <label className="spec-label">RETURN DATE</label>
                        <div className="date-input">
                            <input type="text" defaultValue="Oct 27, 2024" readOnly />
                            <LuCalendar />
                        </div>
                    </div>

                    <Link to="/booking" className="btn-book-now">Book Now</Link>
                    <p className="text-center text-muted" style={{ fontSize: "12px", marginTop: "16px" }}>
                        No commitment required until confirmation
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function DetailsPageComponents() {
    return (
        <>
            <DetailsHero />
            <DetailsContent />
        </>
    );
}
