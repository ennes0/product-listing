from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import requests
import os
import http.client
from datetime import datetime

app = FastAPI(title="Product Listing API", version="1.0.0")


# CORS configuration for development and production
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://product-listing-frontend.onrender.com",  # Render frontend URL
    "https://product-listing-frontend-*.onrender.com",  # Render preview deployments
    "https://product-listing-api-ekqi.onrender.com",  # Current backend URL
    "https://timely-paprenjak-f002ed.netlify.app",  # Netlify deployment URL
    "https://*.netlify.app",  # All Netlify deployments
]

# In production, allow all origins for now (can be restricted later)
if os.environ.get("RENDER"):
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Color(BaseModel):
    name: str
    hex: str

class Product(BaseModel):
    id: int
    name: str
    popularityScore: float
    weight: float
    colors: List[Color]
    images: List[str]
    price: Optional[float] = None

class ProductResponse(BaseModel):
    products: List[Product]
    total: int
    page: int
    per_page: int


gold_price_cache = {"price": 65.0, "last_updated": None}

def get_gold_price():
    """Get current gold price from gold.g.apised.com API with dynamic caching"""
    try:
        # Reduced cache time to 60 seconds for more dynamic updates
        if (gold_price_cache["last_updated"] and 
            (datetime.now() - gold_price_cache["last_updated"]).seconds < 60):
            return gold_price_cache["price"]
        
       
        try:
            print("🔄 Fetching live gold price from gold.g.apised.com...")
            
            conn = http.client.HTTPSConnection("gold.g.apised.com")
            payload = ''
            headers = {
                'x-api-key': 'sk_e63A1f928E800f7bA0Fd9E090EA53E057ED70B66D28bCA88'
            }
            
         
            conn.request("GET", "/v1/latest?metals=XAU&base_currency=USD&currencies=USD&weight_unit=gram", payload, headers)
            res = conn.getresponse()
            data = res.read()
            conn.close()
            
            if res.status == 200:
                response_data = json.loads(data.decode("utf-8"))
                print(f"📊 Gold API Response: {response_data}")
                
              
                if ("status" in response_data and response_data["status"] == "success" and 
                    "data" in response_data and "metal_prices" in response_data["data"] and 
                    "XAU" in response_data["data"]["metal_prices"]):
                    
                    xau_data = response_data["data"]["metal_prices"]["XAU"]
                    if "price" in xau_data:
                        # Price is already in USD per gram from the API
                        gold_per_gram = float(xau_data["price"])
                        
                        gold_price_cache["price"] = round(gold_per_gram, 2)
                        gold_price_cache["last_updated"] = datetime.now()
                        
                        print(f"✅ Updated gold price from Gold API: ${gold_per_gram:.2f} per gram")
                        return gold_price_cache["price"]
                else:
                    print(f"❌ Unexpected API response structure: {response_data}")
            else:
                print(f"❌ Gold API HTTP error: {res.status}")
                
        except Exception as e:
            print(f"❌ Gold API error: {e}")
         
            raise Exception(f"Failed to fetch gold price: {e}")
        
    except Exception as e:
        print(f"Error fetching gold price: {e}")
     
        if gold_price_cache["price"] and gold_price_cache["price"] > 0:
            print(f"💰 Using cached gold price: ${gold_price_cache['price']:.2f} per gram")
            return gold_price_cache["price"]
        else:
            raise Exception("No gold price available and no cached data")

def calculate_price(popularity_score: float, weight: float, gold_price: float) -> float:
    """Calculate product price based on formula: (popularityScore + 1) * weight * goldPrice"""
   
    return (popularity_score + 1) * weight * gold_price

def load_products(force_gold_refresh=False):
    """Load products from JSON file"""
    global gold_price_cache
    
    try:
        with open('products.json', 'r', encoding='utf-8') as file:
            raw_products = json.load(file)
    except FileNotFoundError:
        print("products.json file not found!")
        return []
    except json.JSONDecodeError:
        print("Error parsing products.json file!")
        return []
    
    # Force refresh gold price if requested or if cache is older than 2 minutes
    if (force_gold_refresh or not gold_price_cache["last_updated"] or 
        (datetime.now() - gold_price_cache["last_updated"]).seconds > 120):
        print("🔄 Force refreshing gold price for product calculations...")
        gold_price_cache["last_updated"] = None  # Clear cache to force refresh
    
    products_data = []
    gold_price = get_gold_price()
    
    for i, product in enumerate(raw_products):
       
        popularity_score = product["popularityScore"] * 100  
        popularity_score_for_calculation = product["popularityScore"] 
        
        
        images = [
            product["images"]["yellow"],  # Yellow Gold image (first)
            product["images"]["white"],   # White Gold image (second)
            product["images"]["rose"]     # Rose Gold image (third)
        ]
        
       
        colors = [
            {"name": "Yellow Gold", "hex": "#FECA97"},
            {"name": "White Gold", "hex": "#D9D9D9"}, 
            {"name": "Rose Gold", "hex": "#F1AAA9"}
        ]
        
       
        price = round(calculate_price(popularity_score_for_calculation, product["weight"], gold_price), 2)
        
        product_data = {
            "id": i + 1,
            "name": product["name"],
            "popularityScore": popularity_score,
            "weight": product["weight"],
            "colors": colors,
            "images": images,
            "price": price
        }
        
        products_data.append(product_data)
    
    return [Product(**product) for product in products_data]

@app.get("/")
async def root():
    return {"message": "Product Listing API", "version": "1.0.0", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/products", response_model=ProductResponse)
async def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=50, description="Items per page"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    min_popularity: Optional[float] = Query(None, ge=0, le=100, description="Minimum popularity score"),
    max_popularity: Optional[float] = Query(None, ge=0, le=100, description="Maximum popularity score"),
    refresh: Optional[bool] = Query(False, description="Force refresh gold price and recalculate prices")
):
    """Get products with optional filtering and pagination"""
    
    products = load_products(force_gold_refresh=refresh)
    
    
    filtered_products = products
    
    if min_price is not None:
        filtered_products = [p for p in filtered_products if p.price >= min_price]
    
    if max_price is not None:
        filtered_products = [p for p in filtered_products if p.price <= max_price]
    
    if min_popularity is not None:
        filtered_products = [p for p in filtered_products if p.popularityScore >= min_popularity]
    
    if max_popularity is not None:
        filtered_products = [p for p in filtered_products if p.popularityScore <= max_popularity]
    
    
    total = len(filtered_products)
    start_index = (page - 1) * per_page
    end_index = start_index + per_page
    paginated_products = filtered_products[start_index:end_index]
    
    return ProductResponse(
        products=paginated_products,
        total=total,
        page=page,
        per_page=per_page
    )

@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: int, refresh: Optional[bool] = Query(False, description="Force refresh gold price")):
    """Get a single product by ID"""
    products = load_products(force_gold_refresh=refresh)
    
    for product in products:
        if product.id == product_id:
            return product
    
    raise HTTPException(status_code=404, detail="Product not found")

@app.get("/api/gold-price")
async def get_current_gold_price():
    """Get current gold price"""
    price = get_gold_price()
    return {
        "price": price,
        "currency": "USD",
        "unit": "per_gram",
        "last_updated": gold_price_cache["last_updated"],
        "is_live": True,
        "source": "gold.g.apised.com"
    }

@app.post("/api/gold-price/refresh")
async def refresh_gold_price():
    """Force refresh gold price from external API"""
    global gold_price_cache
    old_price = gold_price_cache["price"]
    
   
    gold_price_cache["last_updated"] = None
    
   
    new_price = get_gold_price()
    
    return {
        "success": True,
        "old_price": old_price,
        "new_price": new_price,
        "currency": "USD",
        "unit": "per_gram",
        "updated_at": gold_price_cache["last_updated"],
        "price_change": round(new_price - old_price, 2),
        "source": "gold.g.apised.com"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Render PORT environment variable
    uvicorn.run(app, host="0.0.0.0", port=port)