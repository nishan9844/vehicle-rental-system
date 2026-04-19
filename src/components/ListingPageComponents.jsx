import React from 'react';
import { Link } from 'react-router-dom';

// ── Filter Sidebar ────────────────────────────────────────────────────────────
export const FilterSidebar = ({
  allBrands,
  selectedBrands,
  onToggleBrand,
  maxPrice,
  onMaxPriceChange,
  transmission,
  onTransmissionChange,
  availableOnly,
  onAvailableOnlyChange,
  hasActiveFilters,
  onClearFilters,
  onCloseMobile,
}) => (
  <aside className="filter-sidebar">
    <h3>Filters</h3>

    {/* Brand */}
    <div className="filter-section">
      <span className="filter-label">Brand</span>
      <div className="checkbox-group">
        {allBrands.length === 0 && (
          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Loading...</span>
        )}
        {allBrands.map((brand) => (
          <label key={brand} className="checkbox-item">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => onToggleBrand(brand)}
            />
            {brand}
          </label>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div className="filter-section">
      <span className="filter-label">Price Range (Day)</span>
      <input
        type="range"
        className="range-slider"
        min="50"
        max="1000"
        step="50"
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(Number(e.target.value))}
      />
      <div className="range-labels">
        <span>NPR 50</span>
        <span style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>NPR {maxPrice}</span>
        <span>NPR 1000</span>
      </div>
    </div>

    {/* Transmission */}
    <div className="filter-section">
      <span className="filter-label">Transmission</span>
      <select
        value={transmission}
        onChange={(e) => onTransmissionChange(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Automatic">Automatic</option>
        <option value="Manual">Manual</option>
      </select>
    </div>

    {/* Available Only */}
    <div className="toggle-container">
      <span>Show Available Only</span>
      <input
        type="checkbox"
        className="switch"
        checked={availableOnly}
        onChange={(e) => onAvailableOnlyChange(e.target.checked)}
      />
    </div>

    {/* Clear Filters */}
    {hasActiveFilters && (
      <button
        onClick={onClearFilters}
        style={{
          marginTop: '1.5rem',
          width: '100%',
          padding: '10px',
          border: '1px solid #fca5a5',
          borderRadius: '10px',
          background: 'white',
          color: '#ef4444',
          fontWeight: 700,
          fontSize: '0.85rem',
          cursor: 'pointer',
        }}
      >
        ✕ Clear All Filters
      </button>
    )}

    {/* Mobile Only Apply Filters Button */}
    {onCloseMobile && (
        <button 
            className="btn-apply-filters" 
            onClick={onCloseMobile}
            style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}
        >
            Apply Filters
        </button>
    )}
  </aside>
);

// ── Car Card ──────────────────────────────────────────────────────────────────
export const CarCard = ({ id, brand, name, price_per_day, fuel_type, transmission, seats, image_url, status }) => (
  <div className="car-card">
    <div className="car-image-container">
      {status === 'AVAILABLE' && <span className="badge">AVAILABLE NOW</span>}
      {image_url ? (
        <img src={image_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
          No Image
        </div>
      )}
    </div>
    <div className="car-info">
      <div className="price-tag">
        <span className="price-value">NPR {price_per_day}</span>
        <span className="price-unit">/ day</span>
      </div>
      <span className="car-brand">{brand}</span>
      <h4 className="car-name">{name}</h4>
      <div className="specs-row">
        {fuel_type && <span>⚡ {fuel_type}</span>}
        {transmission && <span>⚙ {transmission}</span>}
        {seats && <span>👥 {seats} Seats</span>}
      </div>
      <div className="card-actions">
        <Link to={`/details/${id}`} style={{ width: '100%' }}>
          <button className="btn-details" style={{ width: '100%' }}>View Details</button>
        </Link>
        <Link to={`/booking/${id}`} style={{ width: '100%' }}>
          <button className="btn-book" style={{ width: '100%' }}>Book Now</button>
        </Link>
      </div>
    </div>
  </div>
);
