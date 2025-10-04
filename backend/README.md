# Product Listing Backend API

A FastAPI-based backend for the product listing application.

## Features

- RESTful API endpoints for products
- Dynamic price calculation based on gold price
- Product filtering by price range and popularity
- CORS enabled for frontend communication
- Pagination support
- Real-time gold price integration

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
# Development server with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python main.py
```

The API will be available at:
- **Development**: `http://localhost:8000`
- **Production**: `https://product-listing-api-ekqi.onrender.com`

## API Documentation

### Development:
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

### Production:
- Interactive API docs: `https://product-listing-api-ekqi.onrender.com/docs`
- ReDoc documentation: `https://product-listing-api-ekqi.onrender.com/redoc`

## API Endpoints

### Products
- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/{id}` - Get single product by ID
- `GET /api/gold-price` - Get current gold price

### Query Parameters for /api/products:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10, max: 50)
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter
- `min_popularity`: Minimum popularity score (0-100)
- `max_popularity`: Maximum popularity score (0-100)

## Price Calculation

Products prices are calculated using the formula:
```
Price = (popularityScore/100 + 1) * weight * goldPrice
```

Where:
- `popularityScore`: Product popularity (0-100)
- `weight`: Product weight in grams
- `goldPrice`: Current gold price per gram in USD