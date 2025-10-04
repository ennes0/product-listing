import React, { useRef, useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import './ProductList.css';

const ProductList = ({ products, filters, openFilter, onFiltersChange, onFilterToggle }) => {
  const scrollRef = useRef(null);
  const [thumbPosition, setThumbPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const updateThumbPosition = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      const percentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      const trackWidth = scrollRef.current.parentElement.parentElement.querySelector('.swipe-track')?.clientWidth || 0;
      const thumbWidth = 80;
      const maxThumbPosition = trackWidth - thumbWidth;
      setThumbPosition(percentage * maxThumbPosition);
    }
  };

  const handleTrackClick = (e) => {
    e.preventDefault();
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const trackWidth = rect.width;
    const thumbWidth = 80;
    const maxThumbPosition = trackWidth - thumbWidth;
    const newPosition = Math.max(0, Math.min(x - thumbWidth / 2, maxThumbPosition));
    const percentage = maxThumbPosition > 0 ? newPosition / maxThumbPosition : 0;
    
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      scrollRef.current.scrollLeft = percentage * maxScroll;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const track = document.querySelector('.swipe-track');
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const trackWidth = rect.width;
    const thumbWidth = 80;
    const maxThumbPosition = trackWidth - thumbWidth;
    const newPosition = Math.max(0, Math.min(x - thumbWidth / 2, maxThumbPosition));
    const percentage = maxThumbPosition > 0 ? newPosition / maxThumbPosition : 0;
    
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      scrollRef.current.scrollLeft = percentage * maxScroll;
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const handleWheel = (e) => {
        e.preventDefault();
        scrollElement.scrollLeft += e.deltaY;
      };

      scrollElement.addEventListener('scroll', updateThumbPosition);
      scrollElement.addEventListener('wheel', handleWheel, { passive: false });
      updateThumbPosition(); 
      
      return () => {
        scrollElement.removeEventListener('scroll', updateThumbPosition);
        scrollElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, [products]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Product List</h2>
      </div>
      <div className="filters-container-inline">
        <ProductFilter 
          onFiltersChange={onFiltersChange} 
          filters={filters}
          filterType="price"
          title="Price"
          isOpen={openFilter === "price"}
          onToggle={() => onFilterToggle("price")}
        />
        <ProductFilter 
          onFiltersChange={onFiltersChange} 
          filters={filters}
          filterType="popularity"
          title="Rating"
          isOpen={openFilter === "popularity"}
          onToggle={() => onFilterToggle("popularity")}
        />
      </div>
      
      {products.length > 0 ? (
        <>
          <div className="product-list-wrapper">
            <button className="nav-arrow nav-arrow-left" onClick={scrollLeft}>
              &#8249;
            </button>
            
            <div className="product-list" ref={scrollRef}>
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
            
            <button className="nav-arrow nav-arrow-right" onClick={scrollRight}>
              &#8250;
            </button>
          </div>
          <div className="swipe-scroll-area">
            <div className="swipe-track" onClick={handleTrackClick}>
              <div 
                className="swipe-thumb" 
                style={{ left: `${thumbPosition}px` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                }}
              ></div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-products">
          <p>No products available. Please ensure the backend server is running.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;