import React, { useState, useEffect } from "react";
import {
    LuStar, LuBattery, LuUsers, LuTimer, LuZap,
    LuUser, LuCircleCheck
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

// Import images
import teslaImg from "../assets/images/tesla_model_s_1774791127857.png";

export function DetailsHero({ vehicle }) {
    return (
        <section className="details-hero">
            <div className="container">
                <div className="breadcrumb">
                    <Link to="/listing">Vehicles</Link> / <span>{vehicle?.name}</span>
                </div>

                <div className="details-layout">
                    <div className="details-gallery">
                        <div className="gallery-main">
                            <img src={vehicle?.image_url || teslaImg} alt={vehicle?.name} />
                        </div>
                        <div className="gallery-thumbs">
                            <div className="thumb active"><img src={vehicle?.image_url || teslaImg} alt="thumb" /></div>
                        </div>
                    </div>

                    <div className="details-sidebar">
                        <div className="vehicle-header">
                            <div className="fleet-tag" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                                <LuStar style={{ width: "14px", fill: "currentColor" }} /> TOP RATED FLEET
                            </div>
                            <h1 className="vehicle-title">{vehicle?.name}</h1>
                            <div className="vehicle-price">
                                <span className="price-amount">NPR {vehicle?.price_per_day}</span>
                                <span className="price-suffix">/ day</span>
                            </div>
                        </div>

                        <div className="specs-grid">
                            <div className="spec-card">
                                <div className="spec-icon"><LuZap /></div>
                                <div className="spec-info">
                                    <span className="spec-label">Fuel Type</span>
                                    <span className="spec-value">{vehicle?.fuel_type || "N/A"}</span>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="spec-icon"><LuUsers /></div>
                                <div className="spec-info">
                                    <span className="spec-label">Seats</span>
                                    <span className="spec-value">{vehicle?.seats ? `${vehicle.seats} Adults` : "N/A"}</span>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="spec-icon"><LuTimer /></div>
                                <div className="spec-info">
                                    <span className="spec-label">Transmission</span>
                                    <span className="spec-value">{vehicle?.transmission || "N/A"}</span>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="spec-icon"><LuBattery /></div>
                                <div className="spec-info">
                                    <span className="spec-label">Category</span>
                                    <span className="spec-value">{vehicle?.category || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function DetailsContent({ vehicle }) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
    const [canReview, setCanReview] = useState(false);
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, body: "" });

    useEffect(() => {
        if (!vehicle) return;
        const fetchDetails = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            const { data: reviewsData } = await supabase
                .from('reviews')
                .select('id, rating, body, created_at, profiles (name)')
                .eq('vehicle_id', vehicle.id)
                .or('review_type.eq.vehicle,review_type.is.null')
                .order('created_at', { ascending: false });

            if (reviewsData) {
                setReviews(reviewsData);
            }

            setCanReview(!!user);
        };

        fetchDetails();
    }, [vehicle]);

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) : 0;

    const getStarPct = (star) => {
        if (totalReviews === 0) return 0;
        const count = reviews.filter(r => r.rating === star).length;
        return Math.round((count / totalReviews) * 100);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user || !vehicle) return;

        const { error } = await supabase
            .from('reviews')
            .insert({
                user_id: user.id,
                vehicle_id: vehicle.id,
                review_type: 'vehicle',
                rating: newReview.rating,
                body: newReview.body,
                is_verified: true
            });

        if (!error) {
            setShowReviewForm(false);
            setNewReview({ rating: 5, body: "" });
            const { data: reviewsData } = await supabase
                .from('reviews')
                .select('id, rating, body, created_at, profiles(name)')
                .eq('vehicle_id', vehicle.id)
                .or('review_type.eq.vehicle,review_type.is.null')
                .order('created_at', { ascending: false });
            if (reviewsData) setReviews(reviewsData);
        } else {
            alert("Error submitting review: " + error.message);
        }
    };

    return (
        <div className="details-content-layout container">
            <div className="details-main-text">
                <section className="info-section">
                    <h2>{vehicle?.name}</h2>
                    <p>
                        {vehicle?.description || "Experience the thrill of driving with our premium selection."}
                    </p>
                </section>

                <section className="reviews-section">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2>Guest Experiences</h2>
                        {canReview && (
                            <button
                                className="btn btn-primary"
                                style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#3b82f6", color: "#fff", cursor: "pointer" }}
                                onClick={() => setShowReviewForm(!showReviewForm)}
                            >
                                Write Review
                            </button>
                        )}
                        {!user && (
                            <Link
                                to="/signin"
                                className="btn btn-primary"
                                style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#3b82f6", color: "#fff", cursor: "pointer", textDecoration: "none" }}
                            >
                                Login to Review
                            </Link>
                        )}
                    </div>

                    {showReviewForm && (
                        <div style={{ marginBottom: "24px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
                            <h4 style={{ marginTop: 0 }}>Write your review</h4>
                            <form onSubmit={handleReviewSubmit}>
                                <div style={{ marginBottom: "12px" }}>
                                    <label style={{ display: "block", marginBottom: "4px" }}>Rating</label>
                                    <select
                                        value={newReview.rating}
                                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", width: "100%" }}
                                    >
                                        <option value={5}>5 Stars - Excellent</option>
                                        <option value={4}>4 Stars - Good</option>
                                        <option value={3}>3 Stars - Average</option>
                                        <option value={2}>2 Stars - Poor</option>
                                        <option value={1}>1 Star - Terrible</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: "12px" }}>
                                    <label style={{ display: "block", marginBottom: "4px" }}>Review</label>
                                    <textarea
                                        rows="4"
                                        value={newReview.body}
                                        onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                                        required
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", width: "100%" }}
                                        placeholder="Share your experience with this vehicle..."
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#3b82f6", color: "#fff", cursor: "pointer" }}>Submit Review</button>
                            </form>
                        </div>
                    )}

                    <div className="rating-overview">
                        <div className="rating-number">
                            <span>{averageRating}</span>
                            <div className="t-stars" style={{ margin: "14px 0" }}>
                                {[...Array(5)].map((_, i) => (
                                    <LuStar key={i} className={`star ${i < Math.round(averageRating) ? 'filled' : ''}`} />
                                ))}
                            </div>
                            <div className="rating-count">Based on {totalReviews} reviews</div>
                        </div>
                        <div className="rating-bars">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div className="bar-row" key={star}>
                                    <span className="bar-label">{star} stars</span>
                                    <div className="bar"><div className="fill" style={{ width: `${getStarPct(star)}%` }}></div></div>
                                    <span className="bar-pct">{getStarPct(star)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="review-list">
                        {reviews.length === 0 ? (
                            <p>No reviews yet for this vehicle.</p>
                        ) : (
                            reviews.map((review) => (
                                <div className="review-item" key={review.id}>
                                    <div className="review-header">
                                        <div className="t-user">
                                            <div className="t-avatar"><LuUser /></div>
                                            <div className="t-info">
                                                <span className="review-user-name">{review.profiles?.name || "Anonymous User"}</span>
                                                <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="verified-badge">
                                            <LuCircleCheck style={{ width: "16px" }} /> VERIFIED RENTER
                                        </div>
                                    </div>
                                    <div className="t-stars" style={{ margin: "12px 0" }}>
                                        {[...Array(5)].map((_, i) => (
                                            <LuStar key={i} className={`star ${i < review.rating ? 'filled' : ''}`} style={{ width: "12px", fill: i < review.rating ? "currentColor" : "none" }} />
                                        ))}
                                    </div>
                                    <p className="review-body">
                                        {review.body}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <div className="details-booking-widget">
                <div className="booking-card">
                    <h3>Availability</h3>

                    <div className="date-picker-group">
                        <label className="spec-label">PICKUP DATE</label>
                        <div className="date-input" style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="date"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                min={today}
                                style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: 'inherit', fontSize: 'inherit' }}
                            />
                        </div>
                    </div>

                    <div className="date-picker-group">
                        <label className="spec-label">RETURN DATE</label>
                        <div className="date-input" style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                min={pickupDate ? new Date(new Date(pickupDate).getTime() + 86400000).toISOString().split('T')[0] : tomorrow}
                                style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: 'inherit', fontSize: 'inherit' }}
                            />
                        </div>
                    </div>

                    <Link to={vehicle ? `/booking/${vehicle.id}?pickup=${pickupDate}&return=${returnDate}` : "/booking"} className="btn-book-now">Book Now</Link>
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
