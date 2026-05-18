import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaSearch, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ChatbotModal from "./ChatbotModal";

import heroSection from "../assets/images/HeroSection.png";
import teslaImg from "../assets/images/tesla_model_s_1774791127857.png";
import wheels4 from "../assets/images/4wheeler.png";
import wheels2 from "../assets/images/2wheeler.png";
import evImg from "../assets/images/ev.png";

export function Hero() {
    return (
        <section className="hero">
            <div className="container hero-grid">
                <div className="hero-left">
                    <h1>
                        Find Your <span>Perfect</span>
                        <br />
                        Ride
                    </h1>
                    <p>
                        Experience the next generation of mobility. From high-performance
                        electric vehicles to agile urban scooters, enjoy a seamless
                        journey tailored to your lifestyle.
                    </p>
                </div>

                <div className="hero-right">
                    <div className="hero-img-container">
                        <img
                            src={heroSection}
                            alt="Vental Hero Section"
                            className="hero-main-img"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function SearchBar() {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <>
            <div
                className="search-wrapper"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >
                <Link
                    to="/listing"
                    className="search-btn"
                    style={{
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyItems: "center",
                        padding: "16px 32px",
                        fontSize: "18px",
                        borderRadius: "50px",
                    }}
                >
                    <FaSearch style={{ marginRight: "10px" }} />
                    Browse All Vehicles
                </Link>

            </div>

            <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="chatbot-floating-button"
                aria-label="Open rental support chat"
            >
                <FaComments />
            </button>

            <ChatbotModal open={chatOpen} onClose={() => setChatOpen(false)} />
        </>
    );
}

export function VehicleCategories() {
    return (
        <section className="categories">
            <div className="container">
                <h2 className="section-title center">Choose your vehicles</h2>
                <p className="section-sub center">
                    Explore our selection of premium vehicles available for your next adventure.
                </p>

                <div className="category-grid">
                    <Link
                        to="/listing?vehicleType=4%20Wheeler"
                        className="category-item"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h4 className="category-title">4 Wheeler</h4>
                        <div className="category-card">
                            <div className="category-img">
                                <img src={wheels4} alt="4 Wheeler" />
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/listing?vehicleType=2%20Wheeler"
                        className="category-item"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h4 className="category-title">2 Wheeler</h4>
                        <div className="category-card">
                            <div className="category-img">
                                <img src={wheels2} alt="2 Wheeler" />
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/listing?vehicleType=EV"
                        className="category-item"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h4 className="category-title">EV</h4>
                        <div className="category-card">
                            <div className="category-img">
                                <img src={evImg} alt="EV" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function TopChoice() {
    const [topVehicles, setTopVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopVehicles = async () => {
            const { data, error } = await supabase
                .from("vehicles")
                .select("*")
                .limit(3);

            if (!error && data) {
                setTopVehicles(data);
            }

            setLoading(false);
        };

        fetchTopVehicles();
    }, []);

    return (
        <section className="topchoice">
            <div className="container">
                <div className="top-header">
                    <div>
                        <h2 className="section-title">Top Choice</h2>
                        <p className="section-sub">
                            Select from our curated collection of high-performance vehicles.
                        </p>
                    </div>

                    <div className="arrows">
                        <button>
                            <FaArrowLeft />
                        </button>
                        <button>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>

                <div className="car-grid">
                    {loading ? (
                        <p>Loading top choices...</p>
                    ) : topVehicles.length === 0 ? (
                        <p>No top vehicles available at the moment.</p>
                    ) : (
                        topVehicles.map((vehicle) => (
                            <div className="car-card" key={vehicle.id}>
                                <div
                                    className="car-img"
                                    style={{ height: "200px", overflow: "hidden" }}
                                >
                                    <img
                                        src={vehicle.image_url || teslaImg}
                                        alt={vehicle.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>

                                <div className="car-info">
                                    <h3>{vehicle.name}</h3>

                                    <div className="car-meta">
                                        <span>{vehicle.fuel_type || "N/A"}</span>
                                        <span>
                                            {vehicle.seats ? `${vehicle.seats} Seats` : "N/A"}
                                        </span>
                                    </div>

                                    <div className="price-row">
                                        <span className="price">
                                            NPR {vehicle.price_per_day}
                                        </span>
                                        <span className="daily">DAILY</span>
                                    </div>

                                    <Link to={`/details/${vehicle.id}`}>
                                        <button className="details-btn">View Details</button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export function Testimonials() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [reviewForm, setReviewForm] = useState({
        guestName: "",
        rating: 5,
        body: "",
    });

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("reviews")
            .select(`
                id,
                guest_name,
                rating,
                body,
                created_at,
                profiles (name)
            `)
            .eq("review_type", "general")
            .order("created_at", { ascending: false })
            .limit(6);

        if (!error && data) {
            setReviews(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewForm((current) => ({
            ...current,
            [name]: name === "rating" ? Number(value) : value,
        }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const guestName = reviewForm.guestName.trim();
        const body = reviewForm.body.trim();

        if (guestName.length < 2) {
            setMessage("Please enter your name.");
            return;
        }

        if (body.length < 3) {
            setMessage("Please write a short review.");
            return;
        }

        setSubmitting(true);

        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
            .from("reviews")
            .insert({
                user_id: user?.id || null,
                vehicle_id: null,
                guest_name: guestName,
                review_type: "general",
                rating: reviewForm.rating,
                body,
                is_verified: false,
            });

        if (error) {
            setMessage(error.message);
            setSubmitting(false);
            return;
        }

        setReviewForm({ guestName: "", rating: 5, body: "" });
        setMessage("Thanks for sharing your review.");
        await fetchReviews();
        setSubmitting(false);
    };

    return (
        <section className="testimonials">
            <div className="container">
                <h2 className="section-title center">What Our Customers Say</h2>
                <p className="section-sub center">
                    Discover why travelers choose our rental services.
                </p>

                <form className="home-review-form" onSubmit={handleReviewSubmit}>
                    <div className="home-review-fields">
                        <input
                            type="text"
                            name="guestName"
                            value={reviewForm.guestName}
                            onChange={handleReviewChange}
                            placeholder="Your name"
                            maxLength="80"
                            required
                        />
                        <select
                            name="rating"
                            value={reviewForm.rating}
                            onChange={handleReviewChange}
                            aria-label="Rating"
                        >
                            <option value={5}>5 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={3}>3 Stars</option>
                            <option value={2}>2 Stars</option>
                            <option value={1}>1 Star</option>
                        </select>
                    </div>

                    <textarea
                        name="body"
                        value={reviewForm.body}
                        onChange={handleReviewChange}
                        placeholder="Share your rental experience..."
                        rows="4"
                        maxLength="1000"
                        required
                    />

                    <div className="home-review-actions">
                        <button type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                        {message && <span>{message}</span>}
                    </div>
                </form>

                <div className="testimonial-grid">
                    {loading ? (
                        <p style={{ textAlign: "center", width: "100%" }}>
                            Loading reviews...
                        </p>
                    ) : reviews.length === 0 ? (
                        <p style={{ textAlign: "center", width: "100%" }}>
                            No reviews available yet.
                        </p>
                    ) : (
                        reviews.map((review) => (
                            <div className="testimonial-card" key={review.id}>
                                <div className="testimonial-top">
                                    <div className="avatar">
                                        {(review.guest_name || review.profiles?.name || "U")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="testimonial-info">
                                        <h4>{review.guest_name || review.profiles?.name || "Anonymous User"}</h4>
                                    </div>
                                </div>

                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            color={i < review.rating ? "#fbbf24" : "#e5e7eb"}
                                        />
                                    ))}
                                </div>

                                <p>"{review.body}"</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
