# Product Listing Application

A full-stack web application for listing and filtering gold jewelry products with real-time pricing.

## 🚀 Live Demo

- **Backend API**: https://product-listing-api-ekqi.onrender.com
- **API Documentation**: https://product-listing-api-ekqi.onrender.com/docs
- **Frontend**: [To be deployed]

## 🏗️ Architecture

### Backend (FastAPI)
- **Location**: `/backend`
- **Tech Stack**: Python, FastAPI, Uvicorn
- **Features**: 
  - RESTful API
  - Real-time gold price integration
  - Product filtering and pagination
  - CORS enabled

### Frontend (React)
- **Location**: `/frontend`
- **Tech Stack**: React.js, CSS3
- **Features**:
  - Responsive design
  - Product filtering
  - Theme toggle (Light/Dark)
  - Real-time gold price display

## 🛠️ Local Development

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on: `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

## 📋 API Endpoints

- `GET /api/products` - Get products with filtering
- `GET /api/products/{id}` - Get single product
- `GET /api/gold-price` - Get current gold price
- `POST /api/gold-price/refresh` - Refresh gold price

## 🎨 Features

- ✅ Responsive mobile-first design
- ✅ Real-time gold price calculation
- ✅ Product filtering by price and popularity
- ✅ Light/Dark theme toggle
- ✅ Smooth animations and transitions
- ✅ Custom swipe navigation
- ✅ Professional color schemes

## 🚀 Deployment

### Backend (Render.com)
Deployed automatically from this repository at:
`https://product-listing-api-ekqi.onrender.com`

### Frontend
Ready for deployment to Netlify, Vercel, or similar platforms.

## 📱 Screenshots

[Add screenshots here]

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request