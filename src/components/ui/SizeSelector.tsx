import React, { useState, useEffect } from 'react';
import { FormInput } from './FormInput';

interface SizeSelectorProps {
  value?: string;
  onChange: (size: string) => void;
  error?: string;
  className?: string;
}

type SizeType = 'standard' | 'numeric' | 'custom';

const STANDARD_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '2XS', '3XS', '4XS', '5XS',
  '2XL', '3XL', '4XL', '5XL'
];

const NUMERIC_SIZES = Array.from({ length: 50 }, (_, i) => (i + 1).toString());

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  value = '',
  onChange,
  error,
  className = ''
}) => {
  const [sizeType, setSizeType] = useState<SizeType>('standard');
  const [selectedStandardSize, setSelectedStandardSize] = useState('');
  const [selectedNumericSize, setSelectedNumericSize] = useState('');
  const [customSize, setCustomSize] = useState('');

  // Determine size type based on current value
  useEffect(() => {
    if (!value) {
      setSizeType('standard');
      return;
    }

    // Check if it's a standard size
    if (STANDARD_SIZES.includes(value)) {
      setSizeType('standard');
      setSelectedStandardSize(value);
      setSelectedNumericSize('');
      setCustomSize('');
      return;
    }

    // Check if it's a numeric size
    if (NUMERIC_SIZES.includes(value)) {
      setSizeType('numeric');
      setSelectedNumericSize(value);
      setSelectedStandardSize('');
      setCustomSize('');
      return;
    }

    // Otherwise it's custom text
    setSizeType('custom');
    setCustomSize(value);
    setSelectedStandardSize('');
    setSelectedNumericSize('');
  }, [value]);

  const handleSizeTypeChange = (type: SizeType) => {
    setSizeType(type);
    
    // Clear other selections
    setSelectedStandardSize('');
    setSelectedNumericSize('');
    setCustomSize('');
    
    // Clear the value when switching types
    onChange('');
  };

  const handleStandardSizeChange = (size: string) => {
    setSelectedStandardSize(size);
    onChange(size);
  };

  const handleNumericSizeChange = (size: string) => {
    setSelectedNumericSize(size);
    onChange(size);
  };

  const handleCustomSizeChange = (size: string) => {
    setCustomSize(size);
    onChange(size);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Size Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300">
          Size Type
        </label>
        
        <div className="space-y-2">
          {/* Standard Sizes Radio */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="sizeType"
              value="standard"
              checked={sizeType === 'standard'}
              onChange={() => handleSizeTypeChange('standard')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Standard Sizes</span>
          </label>

          {/* Numeric Sizes Radio */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="sizeType"
              value="numeric"
              checked={sizeType === 'numeric'}
              onChange={() => handleSizeTypeChange('numeric')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Numbers</span>
          </label>

          {/* Custom Text Radio */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="sizeType"
              value="custom"
              checked={sizeType === 'custom'}
              onChange={() => handleSizeTypeChange('custom')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Type Text</span>
          </label>
        </div>
      </div>

      {/* Size Selection Based on Type */}
      <div className="space-y-3">
        {/* Standard Sizes Dropdown */}
        {sizeType === 'standard' && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              Select Standard Size
            </label>
            <select
              value={selectedStandardSize}
              onChange={(e) => handleStandardSizeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose a size</option>
              {STANDARD_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Numeric Sizes Dropdown */}
        {sizeType === 'numeric' && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              Select Number
            </label>
            <select
              value={selectedNumericSize}
              onChange={(e) => handleNumericSizeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose a number</option>
              {NUMERIC_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Custom Text Input */}
        {sizeType === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              Enter Custom Size
            </label>
            <FormInput
              value={customSize}
              onChange={(e) => handleCustomSizeChange(e.target.value)}
              placeholder="e.g. One Size, 28-30, Small-Medium"
              error={error}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter any text describing the size (max 20 characters)
            </p>
          </div>
        )}
      </div>

      {/* Current Selection Display */}
      {value && (
        <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Size:</span>
          <span className="text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded border">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};
