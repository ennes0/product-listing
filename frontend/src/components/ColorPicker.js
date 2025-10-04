import React from 'react';
import './ColorPicker.css';

const ColorPicker = ({ colors, selectedColor, onColorChange }) => {
  return (
    <div className="color-picker">
      <div className="color-options">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`color-option ${selectedColor === index ? 'selected' : ''}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onColorChange(index)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;