import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemove(product.id);
    } else {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b last:border-b-0">
      <div className="w-16 h-16 overflow-hidden rounded-lg flex-shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-secondary-900 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-secondary-600">
          ${product.price.toFixed(2)} each
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-right min-w-0">
        <p className="font-medium text-secondary-900">
          ${(product.price * quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(product.id)}
          className="text-error-600 hover:text-error-700 p-1"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
