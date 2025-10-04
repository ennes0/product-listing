// API Base URL - automatically detects environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://product-listing-api-ekqi.onrender.com/api'
  : 'http://localhost:8000/api';

class ApiService {
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.minPrice) queryParams.append('min_price', params.minPrice);
      if (params.maxPrice) queryParams.append('max_price', params.maxPrice);
      if (params.minPopularity) queryParams.append('min_popularity', params.minPopularity);
      if (params.maxPopularity) queryParams.append('max_popularity', params.maxPopularity);
      
      const url = `${API_BASE_URL}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async getGoldPrice() {
    try {
      console.log('🔄 Fetching gold price from API...');
      const response = await fetch(`${API_BASE_URL}/gold-price`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('💰 Gold price received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching gold price:', error);
      throw error;
    }
  }

  async refreshGoldPrice() {
    try {
      console.log('🔄 Refreshing gold price...');
      const response = await fetch(`${API_BASE_URL}/gold-price/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Gold price refreshed:', data);
      return data;
    } catch (error) {
      console.error('Error refreshing gold price:', error);
      throw error;
    }
  }
}

export default new ApiService();