import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Heart, Star } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useCartContext } from '@/contexts/CartContext';
import { formatCurrency } from '@/config/app';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getItemQuantity, cart } = useCartContext();
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className={`product-card group relative ${
      product.status === 'sold_out' 
        ? 'opacity-60 hover:opacity-80 transition-all duration-300' 
        : ''
    }`}>
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-t-2xl">
            <OptimizedImage
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                product.status === 'sold_out'
                  ? 'grayscale brightness-75 group-hover:brightness-90'
                  : 'group-hover:scale-105'
              }`}
              loading="lazy"
            />
            
            {/* Sold Out Overlay */}
            {product.status === 'sold_out' && (
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent flex items-end justify-center pb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-white text-sm font-semibold">Currently Unavailable</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-soft hover:bg-white hover:shadow-medium transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Heart 
              className={`h-4 w-4 ${
                isWishlisted 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Status Badge */}
          {product.status === 'sold_out' && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-gray-800/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg border border-gray-700/50">
                Sold Out
              </div>
            </div>
          )}
          
          {/* Low Stock Warning */}
          {product.status === 'available' && product.quantity <= 5 && product.quantity > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-amber-500/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                Only {product.quantity} left!
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {product.description}
          </p>
          
          {/* Quantity Display */}
          {product.status === 'available' && (
            <div className="mb-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.quantity > 10 ? 'In Stock' : `${product.quantity} in stock`}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price * 1.2)}
              </span>
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-lg font-medium">
              20% OFF
            </span>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={product.status === 'sold_out' || product.quantity === 0}
            className={`w-full transition-all duration-200 ${
              product.status === 'sold_out' 
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600' 
                : 'btn-primary'
            }`}
            size="sm"
          >
            {product.status === 'sold_out' ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Notify When Available
              </>
            ) : quantityInCart > 0 ? (
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
        </div>
      </Link>
    </div>
  );
};
