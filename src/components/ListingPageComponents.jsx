import React from 'react';
import { Link } from 'react-router-dom';

export const FilterSidebar = ({ onApply }) => (
    <aside className="filter-sidebar">
        <h3>Filters</h3>
        <div className="filter-section">
            <span className="filter-label">Brand</span>
            <div className="checkbox-group">
                {['Toyota', 'Tesla', 'BMW', 'Yamaha'].map(brand => (
                    <label key={brand} className="checkbox-item">
                        <input type="checkbox" defaultChecked={brand === 'Tesla'} /> {brand}
                    </label>
                ))}
            </div>
        </div>
        <div className="filter-section">
            <span className="filter-label">Price Range (Day)</span>
            <input type="range" className="range-slider" min="50" max="1000" />
            <div className="range-labels"><span>NPR 50</span><span>NPR 1000</span></div>
        </div>
        <div className="filter-section">
            <span className="filter-label">Transmission</span>
            <select>
                <option>Automatic</option>
            </select>
        </div>
        <div className="toggle-container">
            <span>Show Available Only</span>
            <input type="checkbox" className="switch" defaultChecked />
        </div>
        <button className="btn-apply-filters" onClick={onApply}>
            Apply Filters
        </button>
    </aside>
);

export const CarCard = ({ brand, name, price, type, transmission, seats, power, image }) => (
    <div className="car-card">
        <div className="car-image-container">
            <span className="badge">AVAILABLE NOW</span>
            <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="car-info">
            <div className="price-tag">
                <span className="price-value">NPR {price}</span>
                <span className="price-unit">/ day</span>
            </div>
            <span className="car-brand">{brand}</span>
            <h4 className="car-name">{name}</h4>
            <div className="specs-row">
                <span>⚡ {type}</span>
                <span>⚙ {transmission}</span>
                <span>👥 {seats || power}</span>
            </div>
            <div className="card-actions">
                <Link to="/details" style={{ width: '100%' }}><button className="btn-details" style={{ width: '100%' }}>View Details</button></Link>
                <Link to="/booking" style={{ width: '100%' }}><button className="btn-book" style={{ width: '100%' }}>Book Now</button></Link>
            </div>
        </div>
    </div>
);