import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Search } from 'lucide-react';
import { apiService } from '@/services/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export const ProductList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['products', page, search],
    () => {
      return apiService.getProducts({
        page,
        limit: 12,
        search: search || undefined,
      });
    },
    {
      keepPreviousData: true,
    }
  );

  // Handle the actual API response structure
  const products = Array.isArray(data?.data) ? data.data : [];

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Welcome to SimpleShop
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        loading={isLoading}
        error={error instanceof Error ? error.message : null}
      />

      {/* Pagination - Disabled for now since API doesn't return pagination */}
    </div>
  );
};
