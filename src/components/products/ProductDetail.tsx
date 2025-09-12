import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { useCartContext } from '@/contexts/CartContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, getItemQuantity, updateQuantity } = useCartContext();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => apiService.getProduct(Number(id)),
    {
      enabled: !!id,
    }
  );

  const product = data?.data;
  const quantityInCart = product ? getItemQuantity(product.id) : 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (product && newQuantity >= 0) {
      updateQuantity(product.id, newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert type="error" title="Product not found">
          The product you're looking for doesn't exist or has been removed.
        </Alert>
        <div className="mt-6">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              product.status === 'sold_out' ? 'grayscale brightness-75' : ''
            }`}
          />
          {product.status === 'sold_out' && (
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 shadow-2xl">
                  <div className="text-white text-3xl font-bold mb-2">Sold Out</div>
                  <div className="text-white/80 text-sm">This item is currently unavailable</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </p>
            
            {/* Stock Status */}
            <div className="mt-3">
              {product.status === 'sold_out' ? (
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Sold Out
                  </span>
                  <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
                    Notify me when available
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    product.quantity > 10 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                      : product.quantity > 5 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      product.quantity > 10 ? 'bg-green-500' : product.quantity > 5 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}></div>
                    {product.quantity > 10 ? 'In Stock' : `${product.quantity} left in stock`}
                  </span>
                  {product.quantity <= 5 && product.quantity > 0 && (
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                      ⚠️ Low stock!
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-secondary-900 mb-2">
              Description
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-secondary-700">
                Quantity:
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.status === 'sold_out'}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.status === 'sold_out' || (product.status === 'available' && quantity >= product.quantity)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.status === 'available' && product.quantity < 10 && (
                <span className="text-xs text-orange-600">
                  Max: {product.quantity}
                </span>
              )}
            </div>

            {quantityInCart > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary-600">
                  In cart: {quantityInCart}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(quantityInCart - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(quantityInCart + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.status === 'sold_out' || product.quantity === 0}
                className={`flex-1 transition-all duration-200 ${
                  product.status === 'sold_out' 
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600' 
                    : ''
                }`}
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.status === 'sold_out' ? 'Notify When Available' : 'Add to Cart'}
              </Button>
            </div>

            {product.status === 'sold_out' && (
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Currently Unavailable
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      This product is temporarily out of stock. We'll notify you when it becomes available again.
                    </p>
                    <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
                      Get notified when back in stock →
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {product.status === 'available' && product.quantity <= 5 && product.quantity > 0 && (
              <Alert type="warning" title="Low Stock">
                Only {product.quantity} items left in stock! Order soon to avoid disappointment.
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
