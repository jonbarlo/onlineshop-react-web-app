import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Button } from '@/components/ui/Button';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  viewMode?: 'grid' | 'list';
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null,
  viewMode = 'grid',
}) => {
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load products</p>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No products found</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden">
            <div className="flex">
              <div className="w-32 h-32 flex-shrink-0">
                <OptimizedImage
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg">
                        {typeof product.category === 'object' && product.category !== null 
                          ? (product.category as { name: string }).name 
                          : product.category}
                      </span>
                      {product.status === 'sold_out' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-500 text-white">
                          Sold Out
                        </span>
                      )}
                      {product.quantity <= 5 && product.status !== 'sold_out' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500 text-white">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button 
                      variant="primary" 
                      size="sm"
                      disabled={product.status === 'sold_out' || product.quantity === 0}
                    >
                      {product.status === 'sold_out' ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
