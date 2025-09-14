import React, { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { ProductVariant } from '@/types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant | null) => void;
  className?: string;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants = [],
  selectedVariant,
  onVariantSelect,
  className = ''
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Get unique colors and sizes from variants
  const availableColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));
  const availableSizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));

  // Find available sizes for selected color
  const availableSizesForColor = selectedColor 
    ? Array.from(new Set(variants
        .filter(v => v.color === selectedColor && v.isActive && v.quantity > 0)
        .map(v => v.size)
        .filter(Boolean)
      ))
    : availableSizes;

  // Find available colors for selected size
  const availableColorsForSize = selectedSize 
    ? Array.from(new Set(variants
        .filter(v => v.size === selectedSize && v.isActive && v.quantity > 0)
        .map(v => v.color)
        .filter(Boolean)
      ))
    : availableColors;

  // Find the selected variant based on color and size
  const currentVariant = variants.find(v => 
    v.color === selectedColor && 
    v.size === selectedSize && 
    v.isActive
  );

  // Update parent when variant changes
  useEffect(() => {
    onVariantSelect(currentVariant || null);
  }, [currentVariant, onVariantSelect]);

  // Initialize from selectedVariant prop
  useEffect(() => {
    if (selectedVariant) {
      setSelectedColor(selectedVariant.color);
      setSelectedSize(selectedVariant.size);
    }
  }, [selectedVariant]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Reset size if it's not available for the new color
    if (selectedSize && !availableSizesForColor.includes(selectedSize)) {
      setSelectedSize('');
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Reset color if it's not available for the new size
    if (selectedColor && !availableColorsForSize.includes(selectedColor)) {
      setSelectedColor('');
    }
  };

  // Helper function to get variant quantity (currently unused but kept for future use)
  // const getVariantQuantity = (color: string, size: string) => {
  //   const variant = variants.find(v => v.color === color && v.size === size);
  //   return variant?.quantity || 0;
  // };

  // Helper function to check if a variant is available (currently unused but kept for future use)
  // const isVariantAvailable = (color: string, size: string) => {
  //   const variant = variants.find(v => v.color === color && v.size === size);
  //   return variant ? variant.isActive && variant.quantity > 0 : false;
  // };

  if (variants.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No variants available
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const isSelected = selectedColor === color;
              const isAvailable = availableColorsForSize.includes(color) || !selectedSize;
              
              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  disabled={!isAvailable}
                  className={`
                    relative flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : isAvailable
                        ? 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        : 'border-gray-100 dark:border-gray-700 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  {color.startsWith('#') && (
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {color}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                  {!isAvailable && (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size;
              const isAvailable = availableSizesForColor.includes(size) || !selectedColor;
              
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`
                    relative flex items-center justify-center min-w-[40px] px-3 py-2 rounded-lg border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : isAvailable
                        ? 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        : 'border-gray-100 dark:border-gray-700 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {size}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 absolute -top-1 -right-1" />
                  )}
                  {!isAvailable && (
                    <AlertCircle className="w-4 h-4 text-gray-400 absolute -top-1 -right-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Info */}
      {currentVariant && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                {currentVariant.color} - {currentVariant.size}
              </span>
              <p className="text-xs text-green-600 dark:text-green-400">
                SKU: {currentVariant.sku}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                {currentVariant.quantity} in stock
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No Selection Warning */}
      {!currentVariant && (selectedColor || selectedSize) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Please select both color and size to see availability
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
