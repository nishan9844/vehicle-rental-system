import { FaArrowLeft, FaArrowRight, FaStar, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

// Import images from assets
import heroSection from "../assets/images/HeroSection.png";
import teslaImg from "../assets/images/tesla_model_s_1774791127857.png";
import bikeImg from "../assets/images/bullet_bike_1774791285776.png";
import bmwImg from "../assets/images/bmw_x7_1774791305841.png";
import wheels4 from "../assets/images/4wheeler.png";
import wheels2 from "../assets/images/2wheeler.png";
import evImg from "../assets/images/ev.png";

export function Hero() {
    return (
        <section className="hero">
            <div className="container hero-grid">
                <div className="hero-left">
                    <h1>
                        Find Your <span>Perfect</span><br />
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
                        <img src={heroSection} alt="Vental Hero Section" className="hero-main-img" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function SearchBar() {
    return (
        <div className="search-wrapper">
            <div className="search-bar">
                <div className="search-item">
                    <label>Pick-up Date</label>
                    <p>20-Mar-2025</p>
                </div>
                <div className="divider" />
                <div className="search-item">
                    <label>Return Date</label>
                    <p>Date</p>
                </div>
                <Link to="/listing" className="search-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaSearch style={{ marginRight: '8px' }} /> Search
                </Link>
            </div>
        </div>
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
                    <Link to="/listing" className="category-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h4 className="category-title">4 Wheeler</h4>
                        <div className="category-card">
                            <div className="category-img">
                                <img src={wheels4} alt="4 Wheeler" />
                            </div>
                        </div>
                    </Link>
                    <Link to="/listing" className="category-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h4 className="category-title">2 Wheeler</h4>
                        <div className="category-card">
                            <div className="category-img">
                                <img src={wheels2} alt="2 Wheeler" />
                            </div>
                        </div>
                    </Link>
                    <Link to="/listing" className="category-item" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                        <button><FaArrowLeft /></button>
                        <button><FaArrowRight /></button>
                    </div>
                </div>
                <div className="car-grid">
                    <div className="car-card">
                        <div className="car-img" style={{ height: "200px", overflow: "hidden" }}>
                            <img src={teslaImg} alt="Tesla Model S" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div className="car-info">
                            <h3>Tesla Model S</h3>
                            <div className="car-meta">
                                <span>Electric</span>
                                <span>5 Seats</span>
                            </div>
                            <div className="price-row">
                                <span className="price">NPR 149</span>
                                <span className="daily">DAILY</span>
                            </div>
                            <Link to="/details">
                                <button className="details-btn">View Details</button>
                            </Link>
                        </div>
                    </div>
                    <div className="car-card">
                        <div className="car-img" style={{ height: "200px", overflow: "hidden" }}>
                            <img src={bikeImg} alt="Bullet Bike" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div className="car-info">
                            <h3>Bullet Bike</h3>
                            <div className="car-meta">
                                <span>Petrol</span>
                                <span>Manual</span>
                            </div>
                            <div className="price-row">
                                <span className="price">NPR 89</span>
                                <span className="daily">DAILY</span>
                            </div>
                            <Link to="/details">
                                <button className="details-btn">View Details</button>
                            </Link>
                        </div>
                    </div>
                    <div className="car-card">
                        <div className="car-img" style={{ height: "200px", overflow: "hidden" }}>
                            <img src={bmwImg} alt="BMW X7 M-Sport" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div className="car-info">
                            <h3>BMW X7 M-Sport</h3>
                            <div className="car-meta">
                                <span>Hybrid</span>
                                <span>7 Seats</span>
                            </div>
                            <div className="price-row">
                                <span className="price">NPR 199</span>
                                <span className="daily">DAILY</span>
                            </div>
                            <Link to="/details">
                                <button className="details-btn">View Details</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Testimonials() {
    return (
        <section className="testimonials">
            <div className="container">
                <h2 className="section-title center">
                    What Our Customers Say
                </h2>
                <p className="section-sub center">
                    Discover why travelers choose our rental services.
                </p>
                <div className="testimonial-grid">
                    {[1, 2, 3].map((i) => (
                        <div className="testimonial-card" key={i}>
                            <div className="testimonial-top">
                                <div className="avatar"></div>
                                <div className="testimonial-info">
                                    <h4>Emma Rodriguez</h4>
                                    <p className="location">San Francisco, CA</p>
                                </div>
                            </div>
                            <div className="stars">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                            <p>
                                "I've used many booking platforms before,
                                but none compare to the personalized experience."
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
