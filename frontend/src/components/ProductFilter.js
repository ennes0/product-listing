import React, { useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({ onFiltersChange, filters = {}, filterType = "price", title = "Filter", isOpen = false, onToggle }) => {
  const [localFilters, setLocalFilters] = useState(() => {
    if (filterType === "price") {
      return {
        minPrice: filters.minPrice || '',
        maxPrice: filters.maxPrice || '',
      };
    } else {
      return {
        minPopularity: filters.minPopularity || '',
        maxPopularity: filters.maxPopularity || '',
      };
    }
  });


  const quickFilters = filterType === "price" ? [
    { label: 'Under $200', filter: { maxPrice: 200 } },
    { label: '$200 - $500', filter: { minPrice: 200, maxPrice: 500 } },
    { label: '$500 - $800', filter: { minPrice: 500, maxPrice: 800 } },
    { label: '$800+', filter: { minPrice: 800 } },
  ] : [
    { label: 'Low (0-25)', filter: { minPopularity: 0, maxPopularity: 25 } },
    { label: 'Medium (25-50)', filter: { minPopularity: 25, maxPopularity: 50 } },
    { label: 'High (50-75)', filter: { minPopularity: 50, maxPopularity: 75 } },
    { label: 'Premium (75+)', filter: { minPopularity: 75 } },
  ];

  const handleInputChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    
    
    const cleanFilters = { ...filters };
    
    if (filterType === "price") {
      if (newFilters.minPrice && newFilters.minPrice !== '') cleanFilters.minPrice = parseFloat(newFilters.minPrice);
      else delete cleanFilters.minPrice;
      if (newFilters.maxPrice && newFilters.maxPrice !== '') cleanFilters.maxPrice = parseFloat(newFilters.maxPrice);
      else delete cleanFilters.maxPrice;
    } else {
      if (newFilters.minPopularity && newFilters.minPopularity !== '') cleanFilters.minPopularity = parseFloat(newFilters.minPopularity);
      else delete cleanFilters.minPopularity;
      if (newFilters.maxPopularity && newFilters.maxPopularity !== '') cleanFilters.maxPopularity = parseFloat(newFilters.maxPopularity);
      else delete cleanFilters.maxPopularity;
    }
    
    onFiltersChange(cleanFilters);
  };



  const applyQuickFilter = (quickFilter) => {
    const newFilters = { ...localFilters, ...quickFilter.filter };
    setLocalFilters(newFilters);
    
  
    const cleanFilters = { ...filters, ...quickFilter.filter };
    onFiltersChange(cleanFilters);
  };

  const clearFilters = () => {
    const emptyFilters = filterType === "price" ? {
      minPrice: '',
      maxPrice: '',
    } : {
      minPopularity: '',
      maxPopularity: '',
    };
    setLocalFilters(emptyFilters);
    
   
    const cleanFilters = { ...filters };
    if (filterType === "price") {
      delete cleanFilters.minPrice;
      delete cleanFilters.maxPrice;
    } else {
      delete cleanFilters.minPopularity;
      delete cleanFilters.maxPopularity;
    }
    onFiltersChange(cleanFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');
  const activeFilterCount = Object.values(localFilters).filter(value => value !== '').length;

  return (
    <div className={`product-filter ${isOpen ? 'filter-open' : ''}`}>
      <button 
        className={`filter-toggle ${isOpen ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
        onClick={onToggle}
      >
        {filterType === "price" ? (
          <svg className="filter-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg className="filter-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
        <span className="filter-text">{title}</span>
        {hasActiveFilters && <span className="filter-badge">{activeFilterCount}</span>}
      </button>

      {isOpen && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>{title}</h3>
            <button className="close-btn" onClick={onToggle}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="filter-section">
            <h4>Quick Selection</h4>
            <div className="quick-filters">
              {quickFilters.map((quickFilter, index) => (
                <button
                  key={index}
                  className="quick-filter-btn"
                  onClick={() => applyQuickFilter(quickFilter)}
                >
                  {quickFilter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Range Input */}
          <div className="filter-section">
            <h4>Custom Range</h4>
            <div className="range-container">
              <div className="range-inputs">
                {filterType === "price" ? (
                  <>
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minPrice}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                      className="range-input"
                    />
                    <span className="range-separator">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxPrice}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                      className="range-input"
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="100"
                      value={localFilters.minPopularity}
                      onChange={(e) => handleInputChange('minPopularity', e.target.value)}
                      className="range-input"
                    />
                    <span className="range-separator">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max="100"
                      value={localFilters.maxPopularity}
                      onChange={(e) => handleInputChange('maxPopularity', e.target.value)}
                      className="range-input"
                    />
                  </>
                )}
              </div>
              <div className="range-display">
                {filterType === "price" ? (
                  `${localFilters.minPrice || '0'} — ${localFilters.maxPrice || '∞'} USD`
                ) : (
                  `${localFilters.minPopularity || '0'} — ${localFilters.maxPopularity || '100'} pts`
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="filter-actions">
            {hasActiveFilters && (
              <button className="clear-btn" onClick={clearFilters}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;