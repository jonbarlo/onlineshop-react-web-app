import React, { useState } from 'react';
import { ProductVariant } from '@/types';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  productId: number;
  currentQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  productId,
  currentQuantity,
  onQuantityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!variants || variants.length === 0) {
    return null;
  }

  const handleVariantSelect = (variant: ProductVariant) => {
    onVariantChange(variant);
    setIsOpen(false);
  };

  const getAvailableSizes = (color: string) => {
    return variants.filter(v => v.color === color && v.isActive);
  };

  const getAvailableColors = () => {
    const colors = [...new Set(variants.map(v => v.color))];
    return colors.filter(color => 
      variants.some(v => v.color === color && v.isActive)
    );
  };

  return (
    <div className="mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span>
          {selectedVariant 
            ? `${selectedVariant.color} - ${selectedVariant.size}` 
            : 'Select Variant'
          }
        </span>
        <span className="text-xs">
          {isOpen ? '▲' : '▼'}
        </span>
      </Button>

      {isOpen && (
        <div className="mt-2 p-3 border rounded-lg bg-gray-50 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {getAvailableColors().map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    const sizesForColor = getAvailableSizes(color);
                    if (sizesForColor.length > 0) {
                      handleVariantSelect(sizesForColor[0]);
                    }
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md border text-sm ${
                    selectedVariant?.color === color
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color.startsWith('#') ? (
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ) : null}
                  <span>{color}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedVariant && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {getAvailableSizes(selectedVariant.color).map((variant) => (
                  <button
                    key={`${variant.color}-${variant.size}`}
                    onClick={() => handleVariantSelect(variant)}
                    className={`px-3 py-2 rounded-md border text-sm ${
                      selectedVariant?.size === variant.size
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {variant.size}
                    <span className="ml-1 text-xs text-gray-500">
                      ({variant.quantity} in stock)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedVariant && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-600">
                Stock: {selectedVariant.quantity}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(Math.max(1, currentQuantity - 1))}
                  disabled={currentQuantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center text-sm">{currentQuantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(currentQuantity + 1)}
                  disabled={currentQuantity >= selectedVariant.quantity}
                >
                  +
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
