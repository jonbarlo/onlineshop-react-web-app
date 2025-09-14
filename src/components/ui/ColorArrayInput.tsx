import React, { useState } from 'react';
import { Plus, X, Palette } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { ColorPicker } from './ColorPicker';

interface ColorArrayInputProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  className?: string;
}

export const ColorArrayInput: React.FC<ColorArrayInputProps> = ({
  colors = [],
  onChange,
  className = ''
}) => {
  const [newColor, setNewColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const addColor = (color: string) => {
    if (color && !colors.includes(color)) {
      onChange([...colors, color]);
      setNewColor('');
      setShowColorPicker(false);
    }
  };

  const removeColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    onChange(newColors);
  };

  const handleColorPickerChange = (color: string) => {
    setNewColor(color);
  };

  const handleAddCustomColor = () => {
    if (newColor.trim()) {
      addColor(newColor.trim());
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Product Colors
      </label>
      
      {/* Existing Colors */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
              {color.startsWith('#') ? (
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ) : (
                <Palette className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-900 dark:text-white">{color}</span>
              <button
                onClick={() => removeColor(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Color */}
      <div className="flex space-x-2">
        <Input
          placeholder="Enter color name or hex code"
          value={newColor}
          onChange={setNewColor}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <Palette className="w-4 h-4 mr-1" />
          Pick Color
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddCustomColor}
          disabled={!newColor.trim()}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Pick a Color</h3>
            <ColorPicker
              value={newColor}
              onChange={handleColorPickerChange}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowColorPicker(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addColor(newColor);
                  setShowColorPicker(false);
                }}
                disabled={!newColor.trim()}
              >
                Add Color
              </Button>
            </div>
          </div>
        </div>
      )}

      {colors.length === 0 && (
        <p className="text-sm text-gray-500">No colors added yet</p>
      )}
    </div>
  );
};
