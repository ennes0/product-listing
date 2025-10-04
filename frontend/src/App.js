import React, { useState, useEffect, useCallback } from 'react';
import './fonts.css';
import './App.css';
import './styles/themes.css';
import ProductList from './components/ProductList';
import ThemeToggle from './components/ThemeToggle';
import apiService from './services/apiService';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goldPrice, setGoldPrice] = useState(null);
  const [goldPriceInfo, setGoldPriceInfo] = useState(null);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { 
        per_page: 20,
        ...filters
      };
      const response = await apiService.getProducts(params);
      setProducts(response.products);
      setError(null);
      console.log('✅ Products loaded with updated prices and filters');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please make sure the backend server is running.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchGoldPrice = useCallback(async () => {
    try {
      const response = await apiService.getGoldPrice();
      setGoldPrice(response.price);
      setGoldPriceInfo(response);
      console.log('✅ Gold price loaded:', response);
    } catch (error) {
      console.error('Error fetching gold price:', error);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchGoldPrice()]);
  }, [fetchProducts, fetchGoldPrice]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterToggle = (filterType) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openFilter && !event.target.closest('.product-filter')) {
        setOpenFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openFilter]);



  const refreshPrices = async () => {
    try {
      console.log('🔄 Refreshing all prices...');
      
      const goldResponse = await apiService.refreshGoldPrice();
      setGoldPrice(goldResponse.new_price);
      setGoldPriceInfo({
        price: goldResponse.new_price,
        last_updated: goldResponse.updated_at,
        is_live: true,
        source: goldResponse.source
      });
      
      await fetchProducts();
      
      console.log('✅ All prices refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing prices:', error);
      setError('Failed to refresh prices. Please check your connection.');
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products and live gold prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <ThemeToggle />

      {goldPrice && (
        <div className="minimal-gold-price">
          <span className="minimal-gold-icon">💰</span>
          <span className="minimal-gold-text">
            ${goldPrice.toFixed(2)}/g
          </span>
          {goldPriceInfo?.is_live && (
            <span className="minimal-live-dot"></span>
          )}
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={loadAllData}>Retry</button>
        </div>
      )}
      
      <div className="products-section">
        <ProductList 
          products={products} 
          goldPrice={goldPrice}
          onRefresh={refreshPrices}
          filters={filters}
          openFilter={openFilter}
          onFiltersChange={handleFiltersChange}
          onFilterToggle={handleFilterToggle}
        />
      </div>
    </div>
  );
}

export default App;
