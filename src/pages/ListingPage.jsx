import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FilterSidebar, CarCard } from '../components/ListingPageComponents';
import '../css/listing.css';

import teslaImg from "../assets/images/tesla_model_s_1774791127857.png";
import bikeImg from "../assets/images/bullet_bike_1774791285776.png";
import bmwImg from "../assets/images/bmw_x7_1774791305841.png";

const ListingPage = () => {
    const [filterOpen, setFilterOpen] = useState(false);

    const cars = [
        { brand: 'Tesla', name: 'Model S Plaid', price: 189, type: 'Electric', transmission: 'AWD', seats: '5 Seats', image: teslaImg },
        { brand: 'BMW', name: 'M8 Competition', price: 245, type: 'Gasoline', transmission: 'Automatic', power: '320 km/h', image: bmwImg },
        { brand: 'BMW', name: 'X7 Luxury', price: 199, type: 'Gasoline', transmission: 'Automatic', seats: '7 Seats', image: bmwImg },
        { brand: 'Yamaha', name: 'R1M', price: 120, type: 'Superbike', transmission: 'Manual', power: '998cc', image: bikeImg },
    ];

    return (
        <div>
            <Navbar />
            <main className="listing-container">
                {/* Mobile filter toggle button */}
                <button
                    className="mobile-filter-btn"
                    onClick={() => setFilterOpen(true)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filters
                </button>

                {/* Overlay for mobile */}
                {filterOpen && <div className="filter-overlay" onClick={() => setFilterOpen(false)}></div>}

                <div className={`filter-wrapper ${filterOpen ? 'open' : ''}`}>
                    <FilterSidebar onApply={() => setFilterOpen(false)} />
                </div>

                <section>
                    <div className="search-sort-bar">
                        <div className="search-input-wrapper">
                            <span style={{ position: 'absolute', left: '15px', top: '9px' }}>🔍</span>
                            <input type="text" placeholder="Search for models, brands, or features..." />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="sort-label">Sort by:</span>
                            <select className="sort-select">
                                <option>Newest</option>
                            </select>
                        </div>
                    </div>

                    <div className="cars-grid">
                        {cars.map((car, idx) => <CarCard key={idx} {...car} />)}
                    </div>

                    <div className="show-more-container">
                        <button className="btn-show-more">
                            Show More Results ∨
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ListingPage;