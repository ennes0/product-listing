import React, { useState, useEffect } from 'react';
import './fonts.css';
import './App.css';
import './styles/themes.css';
import ProductList from './components/ProductList';
import ProductFilter from './components/ProductFilter';
import ThemeToggle from './components/ThemeToggle';
import apiService from './services/apiService';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goldPrice, setGoldPrice] = useState(null);
  const [goldPriceInfo, setGoldPriceInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const loadAllData = async () => {
    await Promise.all([fetchProducts(), fetchGoldPrice()]);
  };

  const fetchProducts = async () => {
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
  };

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

  const fetchGoldPrice = async () => {
    try {
      const response = await apiService.getGoldPrice();
      setGoldPrice(response.price);
      setGoldPriceInfo(response);
      console.log('✅ Gold price loaded:', response);
    } catch (error) {
      console.error('Error fetching gold price:', error);
    }
  };

  const refreshPrices = async () => {
    try {
      setRefreshing(true);
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
    } finally {
      setRefreshing(false);
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
