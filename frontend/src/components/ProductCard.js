import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(0);

 
  const popularityOut5 = ((product.popularityScore / 100) * 5).toFixed(1);


  const price = product.price || 0;


  const renderStars = () => {
    const rating = parseFloat(popularityOut5);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="star filled">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="star empty">★</span>
        ))}
        <span className="rating-text">{popularityOut5}</span>
      </div>
    );
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.images[selectedColor]} 
          alt={product.name}
          className="product-image"
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-price">${price.toFixed(2)} USD</div>
        
        <ColorPicker 
          colors={product.colors}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
        
        <div className="product-color-name">{product.colors[selectedColor].name}</div>
        
        {renderStars()}
      </div>
    </div>
  );
};

export default ProductCard;