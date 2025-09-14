import React, { useState, useEffect } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { Palette } from 'lucide-react';
import { Modal } from './Modal';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Click to select color',
  error,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isValidHex, setIsValidHex] = useState(false);

  // Validate hex color format
  const validateHex = (color: string): boolean => {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexPattern.test(color);
  };

  // Update input value when prop changes
  useEffect(() => {
    console.log('ColorPicker - Received value:', value);
    const trimmedValue = value?.trim() || '';
    setInputValue(trimmedValue);
    setIsValidHex(validateHex(trimmedValue));
  }, [value]);

  const handleColorChange = (color: ColorResult) => {
    const hexColor = color.hex;
    setInputValue(hexColor);
    setIsValidHex(true);
    onChange(hexColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Check if it's a valid hex color
    const isValid = validateHex(newValue);
    setIsValidHex(isValid);
    
    // Only call onChange if it's valid or empty
    if (isValid || newValue === '') {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    // If input is not empty but not valid hex, clear it
    if (inputValue && !isValidHex) {
      setInputValue('');
      onChange('');
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Color Input with Picker Button */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              error 
                ? 'border-red-300 focus:ring-red-500' 
                : isValidHex && inputValue
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300'
            }`}
          />
          
          {/* Validation indicator */}
          {inputValue && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValidHex ? (
                <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: inputValue }} />
              ) : (
                <div className="w-4 h-4 rounded-full bg-red-500" />
              )}
            </div>
          )}
        </div>
        
        {/* Color Picker Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          title="Open color picker"
        >
          <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Color Preview */}
      {isValidHex && inputValue && (
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded border border-gray-300 shadow-sm"
            style={{ backgroundColor: inputValue }}
            title={inputValue}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {inputValue}
          </span>
        </div>
      )}

      {/* Color Picker Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Color"
        size="sm"
      >
        <div className="space-y-4">
          <ChromePicker
            color={isValidHex && inputValue ? inputValue : '#000000'}
            onChange={handleColorChange}
            disableAlpha={true}
          />
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: isValidHex && inputValue ? inputValue : '#000000' }}
              />
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {isValidHex && inputValue ? inputValue : '#000000'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Click the palette icon to open the color picker or type a hex code
      </p>
    </div>
  );
};
