import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null,
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
        <p className="text-error-600 mb-4">Failed to load products</p>
        <p className="text-secondary-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">No products found</p>
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
