import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FilterSidebar, CarCard } from '../components/ListingPageComponents';
import { supabase } from '../supabaseClient';
import '../css/listing.css';

// Supabase helpers
const fetchVehicles = async (filters = {}, page = 1) => {
  let query = supabase.from('vehicles').select('*');

  if (filters.availableOnly) {
    query = query.eq('status', 'AVAILABLE');
  }
  if (filters.brands && filters.brands.length > 0) {
    query = query.in('brand', filters.brands);
  }
  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }
  if (filters.transmission && filters.transmission !== 'All') {
    query = query.eq('transmission', filters.transmission);
  }
  if (filters.maxPrice && filters.maxPrice < 50000) {
    query = query.lte('price_per_day', filters.maxPrice);
  }
  if (filters.sort === 'Price Low') {
    query = query.order('price_per_day', { ascending: true });
  } else if (filters.sort === 'Price High') {
    query = query.order('price_per_day', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const limit = 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

const fetchBrands = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('brand')
    .neq('brand', null);
  if (error) throw error;
  return [...new Set(data.map((v) => v.brand))];
};

// Page Component
const ListingPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';

  const [vehicles, setVehicles] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [transmission, setTransmission] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState('Newest');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load brands once
  useEffect(() => {
    fetchBrands().then(setAllBrands).catch(console.error);
  }, []);

  // Sync category with URL param if it changes (e.g. user clicks another category on home while on listing)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newCategory = params.get('category') || 'All';
    setCategory(newCategory);
  }, [location.search]);

  // Reload vehicles when filters change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchVehicles({ brands: selectedBrands, category, maxPrice, transmission, availableOnly, sort }, 1)
      .then((data) => {
        setVehicles(data);
        setHasMore(data.length === 12);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedBrands, category, maxPrice, transmission, availableOnly, sort]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVehicles({ brands: selectedBrands, category, maxPrice, transmission, availableOnly, sort }, nextPage)
      .then((data) => {
        setVehicles((prev) => [...prev, ...data]);
        setHasMore(data.length === 12);
      })
      .catch(console.error);
  };

  // Client-side search on top of server filters
  const filtered = vehicles.filter(
    (v) =>
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setCategory('All');
    setMaxPrice(50000);
    setTransmission('All');
    setAvailableOnly(false);
    setSearch('');
    setSort('Newest');
    // Clear URL query parameters
    window.history.replaceState(null, '', location.pathname);
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    category !== 'All' ||
    maxPrice < 50000 ||
    transmission !== 'All' ||
    availableOnly ||
    !!search;

  return (
    <div>
      <Navbar />
      <main className="listing-container">
        <button 
            className="mobile-filter-btn" 
            onClick={() => setIsFilterOpen(true)}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Apply Filter
        </button>

        {isFilterOpen && <div className="filter-overlay" onClick={() => setIsFilterOpen(false)}></div>}

        <div className={`filter-wrapper ${isFilterOpen ? "open" : ""}`}>
          <FilterSidebar
            allBrands={allBrands}
            selectedBrands={selectedBrands}
            onToggleBrand={toggleBrand}
            category={category}
            onCategoryChange={setCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            transmission={transmission}
            onTransmissionChange={setTransmission}
            availableOnly={availableOnly}
            onAvailableOnlyChange={setAvailableOnly}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onCloseMobile={() => setIsFilterOpen(false)}
          />
        </div>

        <section>
          {/* Search + Sort */}
          <div className="search-sort-bar">
            <div className="search-input-wrapper">
              <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search for models, brands, or features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="sort-label">Sort by:</span>
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="Newest">Newest</option>
                <option value="Price Low">Price: Low to High</option>
                <option value="Price High">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-placeholder)' }}>
            {loading ? 'Loading...' : `${filtered.length} vehicle${filtered.length !== 1 ? 's' : ''} found`}
          </p>

          {/* Grid */}
          {loading ? (
            <div className="cars-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="car-card" style={{ opacity: 0.5 }}>
                  <div className="car-image-container" style={{ background: '#e2e8f0' }} />
                  <div className="car-info">
                    <div style={{ height: 16, background: '#e2e8f0', borderRadius: 8, marginBottom: 12, width: '40%' }} />
                    <div style={{ height: 24, background: '#e2e8f0', borderRadius: 8, marginBottom: 8, width: '70%' }} />
                    <div style={{ height: 14, background: '#e2e8f0', borderRadius: 8, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No vehicles found
              </p>
              <p style={{ color: 'var(--text-placeholder)', marginBottom: '1.5rem' }}>
                Try adjusting your filters or search term
              </p>
              <button
                onClick={clearFilters}
                style={{
                  padding: '10px 24px',
                  border: '1px solid var(--primary-blue)',
                  borderRadius: '10px',
                  background: 'white',
                  color: 'var(--primary-blue)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="cars-grid">
                {filtered.map((vehicle) => (
                  <CarCard key={vehicle.id} {...vehicle} />
                ))}
              </div>
              {hasMore && filtered.length > 0 && (
                <div className="show-more-container">
                  <button className="btn-show-more" onClick={loadMore}>
                    Show More Results
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ListingPage;
