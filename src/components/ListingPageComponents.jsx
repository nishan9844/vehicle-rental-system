import React from 'react';
import { Link } from 'react-router-dom';
import defaultCarImg from '../assets/images/4wheeler.png';
import defaultBikeImg from '../assets/images/2wheeler.png';
import defaultEvImg from '../assets/images/ev.png';
import bmwX7Img from '../assets/images/bmw_x7_1774791305841.png';
import bulletBikeImg from '../assets/images/bullet_bike_1774791285776.png';
import teslaModelSImg from '../assets/images/tesla_model_s_1774791127857.png';

const getVehicleImage = ({ brand, name, vehicle_type, fuel_type, image_url }) => {
  if (image_url) return image_url;

  const vehicleText = `${brand || ''} ${name || ''} ${vehicle_type || ''} ${fuel_type || ''}`.toLowerCase();

  if (vehicleText.includes('tesla') || vehicleText.includes('model s')) {
    return teslaModelSImg;
  }

  if (vehicleText.includes('bmw') || vehicleText.includes('x7')) {
    return bmwX7Img;
  }

  if (
    vehicleText.includes('bullet') ||
    vehicleText.includes('royal enfield') ||
    vehicleText.includes('yamaha') ||
    vehicleText.includes('bike') ||
    vehicleText.includes('2 wheeler')
  ) {
    return bulletBikeImg || defaultBikeImg;
  }

  if (vehicleText.includes('electric') || vehicleText.includes('ev')) {
    return defaultEvImg;
  }

  return defaultCarImg;
};

export const FilterSidebar = ({
  allBrands,
  selectedBrands,
  onToggleBrand,
  maxPrice,
  onMaxPriceChange,
  sort,
  onSortChange,
  transmission,
  onTransmissionChange,
  vehicleType,
  onVehicleTypeChange,
  availableOnly,
  onAvailableOnlyChange,
  hasActiveFilters,
  onClearFilters,
  onCloseMobile,
}) => (
  <aside className="filter-sidebar">
    <h3>Filters</h3>

    <div className="filter-section">
      <span className="filter-label">Vehicle Type</span>
      <select
        value={vehicleType}
        onChange={(e) => onVehicleTypeChange(e.target.value)}
      >
        <option value="All">All</option>
        <option value="4 Wheeler">4 Wheeler</option>
        <option value="2 Wheeler">2 Wheeler</option>
        <option value="EV">EV</option>
      </select>
    </div>

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

    <div className="filter-section">
      <span className="filter-label">Max Price Per Day</span>
      <input
        type="range"
        className="range-slider"
        min="500"
        max="30000"
        step="500"
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(Number(e.target.value))}
      />
      <div className="range-labels">
        <span>NPR 500</span>
        <span style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>NPR {maxPrice.toLocaleString()}</span>
        <span>NPR 30,000</span>
      </div>
      <div className="price-order-toggle" aria-label="Sort listings by price">
        <button
          type="button"
          className={sort === 'Price Low' ? 'active' : ''}
          onClick={() => onSortChange('Price Low')}
        >
          Low to High
        </button>
        <button
          type="button"
          className={sort === 'Price High' ? 'active' : ''}
          onClick={() => onSortChange('Price High')}
        >
          High to Low
        </button>
      </div>
    </div>

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

    <div className="toggle-container">
      <span>Show Available Only</span>
      <input
        type="checkbox"
        className="switch"
        checked={availableOnly}
        onChange={(e) => onAvailableOnlyChange(e.target.checked)}
      />
    </div>

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
        Clear All Filters
      </button>
    )}

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

export const CarCard = ({
  id,
  brand,
  name,
  price_per_day,
  fuel_type,
  vehicle_type,
  transmission,
  seats,
  image_url,
  status,
}) => {
  const displayImage = getVehicleImage({ brand, name, vehicle_type, fuel_type, image_url });

  return (
    <div className="car-card">
      <div className="car-image-container">
        {status === 'AVAILABLE' && <span className="badge">AVAILABLE NOW</span>}
        <img
          src={displayImage}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.src = vehicle_type === '2 Wheeler' ? defaultBikeImg : defaultCarImg;
          }}
        />
      </div>

      <div className="car-info">
        <div className="price-tag">
          <span className="price-value">NPR {price_per_day?.toLocaleString()}</span>
          <span className="price-unit">/ day</span>
        </div>
        <span className="car-brand">{brand}</span>
        <h4 className="car-name">{name}</h4>
        <div className="specs-row">
          {vehicle_type && <span>{vehicle_type}</span>}
          {fuel_type && <span>{fuel_type}</span>}
          {transmission && <span>{transmission}</span>}
          {seats && <span>{seats} Seats</span>}
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
};
