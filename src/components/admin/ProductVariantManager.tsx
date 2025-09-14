import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { ProductVariant } from '@/types';

interface ProductVariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  className?: string;
}

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
// const NUMBER_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];

export const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({
  variants = [],
  onChange,
  className = ''
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [newVariant, setNewVariant] = useState({
    color: '',
    size: '',
    quantity: 0,
    sku: '',
    isActive: true
  });

  const generateSKU = (color: string, size: string) => {
    const colorCode = color.substring(0, 3).toUpperCase();
    const sizeCode = size.toUpperCase();
    return `${colorCode}-${sizeCode}-${Date.now().toString().slice(-4)}`;
  };

  const handleAddVariant = () => {
    if (!newVariant.color.trim() || !newVariant.size.trim()) {
      alert('Please enter both color and size');
      return;
    }

    // Check if variant already exists
    const exists = variants.some(v => 
      v.color.toLowerCase() === newVariant.color.toLowerCase() && 
      v.size.toLowerCase() === newVariant.size.toLowerCase()
    );

    if (exists) {
      alert('This color/size combination already exists');
      return;
    }

    const variant: ProductVariant = {
      id: Date.now(), // Temporary ID for new variants
      productId: 0, // Will be set by parent
      color: newVariant.color.trim(),
      size: newVariant.size.trim(),
      quantity: newVariant.quantity,
      sku: newVariant.sku || generateSKU(newVariant.color, newVariant.size),
      isActive: newVariant.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onChange([...variants, variant]);
    setNewVariant({ color: '', size: '', quantity: 0, sku: '', isActive: true });
    setIsAdding(false);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setNewVariant({
      color: variant.color,
      size: variant.size,
      quantity: variant.quantity,
      sku: variant.sku,
      isActive: variant.isActive
    });
    setIsAdding(true);
  };

  const handleUpdateVariant = () => {
    if (!editingVariant || !newVariant.color.trim() || !newVariant.size.trim()) {
      return;
    }

    // Check if another variant has the same color/size combination
    const exists = variants.some(v => 
      v.id !== editingVariant.id &&
      v.color.toLowerCase() === newVariant.color.toLowerCase() && 
      v.size.toLowerCase() === newVariant.size.toLowerCase()
    );

    if (exists) {
      alert('This color/size combination already exists');
      return;
    }

    const updatedVariants = variants.map(v =>
      v.id === editingVariant.id
        ? {
            ...v,
            color: newVariant.color.trim(),
            size: newVariant.size.trim(),
            quantity: newVariant.quantity,
            sku: newVariant.sku.trim() || generateSKU(newVariant.color, newVariant.size),
            isActive: newVariant.isActive,
            updatedAt: new Date().toISOString()
          }
        : v
    );

    onChange(updatedVariants);
    setEditingVariant(null);
    setNewVariant({ color: '', size: '', quantity: 0, sku: '', isActive: true });
    setIsAdding(false);
  };

  const handleDeleteVariant = (variantId: number) => {
    if (confirm('Are you sure you want to delete this variant?')) {
      onChange(variants.filter(v => v.id !== variantId));
    }
  };

  const handleCancel = () => {
    setEditingVariant(null);
    setNewVariant({ color: '', size: '', quantity: 0, sku: '', isActive: true });
    setIsAdding(false);
  };

  const addQuickVariant = (color: string, size: string) => {
    setNewVariant({
      color,
      size,
      quantity: 0,
      sku: generateSKU(color, size),
      isActive: true
    });
    setIsAdding(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Product Variants
        </h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Variant
        </Button>
      </div>

      {/* Quick Add Buttons */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Add Common Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {STANDARD_SIZES.map(size => (
            <Button
              key={size}
              variant="outline"
              size="sm"
              onClick={() => addQuickVariant('', size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            {editingVariant ? 'Edit Variant' : 'Add New Variant'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color *
              </label>
              <ColorPicker
                value={newVariant.color}
                onChange={(color) => setNewVariant(prev => ({ ...prev, color }))}
                placeholder="Click to select color or enter hex code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Size *
              </label>
              <Input
                placeholder="e.g., S, M, L, 32, 34"
                value={newVariant.size}
                onChange={(value) => setNewVariant(prev => ({ ...prev, size: value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity *
              </label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={newVariant.quantity.toString()}
                onChange={(value) => setNewVariant(prev => ({ ...prev, quantity: parseInt(value) || 0 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU
              </label>
              <Input
                placeholder="Auto-generated"
                value={newVariant.sku}
                onChange={(value) => setNewVariant(prev => ({ ...prev, sku: value }))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newVariant.isActive}
                onChange={(e) => setNewVariant(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={editingVariant ? handleUpdateVariant : handleAddVariant}
              >
                {editingVariant ? 'Update' : 'Add'} Variant
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Variants List */}
      {variants.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Variants ({variants.length})
          </h4>
          <div className="space-y-2">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center space-x-4">
                  {variant.color.startsWith('#') && (
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.color }}
                      title={variant.color}
                    />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {variant.color} - {variant.size}
                      </span>
                      {!variant.isActive && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      SKU: {variant.sku} • Qty: {variant.quantity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditVariant(variant)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVariant(variant.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No variants added yet</p>
          <p className="text-sm">Add variants to track inventory by color and size</p>
        </div>
      )}
    </div>
  );
};
