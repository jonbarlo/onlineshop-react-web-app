import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCartContext } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getItemQuantity, cart } = useCartContext();
  const [quantityInCart, setQuantityInCart] = useState(0);

  // Update quantity when cart changes
  useEffect(() => {
    const quantity = getItemQuantity(product.id);
    setQuantityInCart(quantity);
  }, [cart.items, product.id, getItemQuantity]);

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('ProductCard: Adding to cart:', product.name);
    addToCart(product, 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            {!product.isActive && (
              <span className="text-xs bg-error-100 text-error-600 px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!product.isActive}
            className="w-full"
            size="sm"
          >
            {quantityInCart > 0 ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                In Cart ({quantityInCart})
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
