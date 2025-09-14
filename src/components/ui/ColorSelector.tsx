import React from 'react';
import { Check } from 'lucide-react';

interface ColorSelectorProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  className?: string;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  className = ''
}) => {
  if (!colors || colors.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No colors available
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Color:
      </label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => {
          const isSelected = selectedColor === color;
          const isHexColor = color.startsWith('#');
          
          return (
            <button
              key={index}
              onClick={() => onColorSelect(color)}
              className={`
                relative flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              {isHexColor && (
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
            </button>
          );
        })}
      </div>
    </div>
  );
};
