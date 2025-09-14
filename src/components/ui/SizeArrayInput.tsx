import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface SizeArrayInputProps {
  sizes: string[];
  onChange: (sizes: string[]) => void;
  className?: string;
}

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const NUMBER_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];

export const SizeArrayInput: React.FC<SizeArrayInputProps> = ({
  sizes = [],
  onChange,
  className = ''
}) => {
  const [newSize, setNewSize] = useState('');
  const [showStandardSizes, setShowStandardSizes] = useState(false);
  const [showNumberSizes, setShowNumberSizes] = useState(false);

  const addSize = (size: string) => {
    if (size && !sizes.includes(size)) {
      onChange([...sizes, size]);
      setNewSize('');
    }
  };

  const removeSize = (index: number) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    onChange(newSizes);
  };

  const handleAddCustomSize = () => {
    if (newSize.trim()) {
      addSize(newSize.trim());
    }
  };

  const addStandardSize = (size: string) => {
    addSize(size);
    setShowStandardSizes(false);
  };

  const addNumberSize = (size: string) => {
    addSize(size);
    setShowNumberSizes(false);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Product Sizes
      </label>
      
      {/* Existing Sizes */}
      {sizes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sizes.map((size, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-white">{size}</span>
              <button
                onClick={() => removeSize(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStandardSizes(!showStandardSizes)}
        >
          Standard Sizes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNumberSizes(!showNumberSizes)}
        >
          Numbers
        </Button>
      </div>

      {/* Standard Sizes */}
      {showStandardSizes && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Standard Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {STANDARD_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => addStandardSize(size)}
                disabled={sizes.includes(size)}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Number Sizes */}
      {showNumberSizes && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Number Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {NUMBER_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => addNumberSize(size)}
                disabled={sizes.includes(size)}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Size Input */}
      <div className="flex space-x-2">
        <Input
          placeholder="Enter custom size"
          value={newSize}
          onChange={setNewSize}
          className="flex-1"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddCustomSize}
          disabled={!newSize.trim()}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {sizes.length === 0 && (
        <p className="text-sm text-gray-500">No sizes added yet</p>
      )}
    </div>
  );
};
