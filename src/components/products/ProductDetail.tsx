import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
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
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </p>
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
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
                disabled={!product.isActive}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {!product.isActive && (
              <Alert type="warning" title="Out of Stock">
                This product is currently unavailable.
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
