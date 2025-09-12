import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, Filter, Grid, List } from 'lucide-react';
import { apiService } from '@/services/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';

interface CategoryPageParams {
  category: string;
  [key: string]: string | undefined;
}

const categoryInfo: Record<string, { name: string; description: string; icon: string }> = {
  electronics: {
    name: 'Electronics',
    description: 'Latest gadgets, smartphones, laptops, and tech accessories',
    icon: '📱'
  },
  clothing: {
    name: 'Clothing',
    description: 'Fashion for men, women, and kids - style for every occasion',
    icon: '👕'
  },
  home: {
    name: 'Home & Garden',
    description: 'Furniture, decor, kitchen essentials, and garden supplies',
    icon: '🏠'
  },
  'sports-outdoors': {
    name: 'Sports & Outdoors',
    description: 'Athletic gear, fitness equipment, and outdoor adventure',
    icon: '⚽'
  },
  books: {
    name: 'Books',
    description: 'Fiction, non-fiction, educational, and digital books',
    icon: '📚'
  },
  automotive: {
    name: 'Automotive',
    description: 'Car parts, accessories, tools, and maintenance supplies',
    icon: '🚗'
  },
  health: {
    name: 'Health & Beauty',
    description: 'Skincare, cosmetics, wellness, and personal care',
    icon: '💄'
  },
  baby: {
    name: 'Baby & Kids',
    description: 'Toys, clothing, safety gear, and parenting essentials',
    icon: '👶'
  }
};

export const CategoryPage: React.FC = () => {
  const { category } = useParams<CategoryPageParams>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categoryData = category ? categoryInfo[category] : null;

  const { data, isLoading, error } = useQuery(
    ['products', 'category', category],
    () => {
      if (!category) {
        return Promise.resolve({
          success: true,
          message: 'No category specified',
          data: { items: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 12 } },
          timestamp: new Date().toISOString()
        });
      }
      
      console.log('Fetching products for category:', category);
      
      return apiService.getProductsByCategory(category, {
        page: 1,
        limit: 50, // Get more products for client-side filtering
      });
    },
    {
      keepPreviousData: true,
      enabled: !!category,
      staleTime: 15 * 60 * 1000, // 15 minutes - products don't change often
      cacheTime: 60 * 60 * 1000, // 1 hour - keep in cache longer
    }
  );

  // Debug API response
  console.log('CategoryPage - API Response:', data);
  console.log('CategoryPage - Error:', error);
  console.log('CategoryPage - Loading:', isLoading);

  // Handle the actual API response structure - check both possible structures
  const allProducts = data?.data?.items ? data.data.items : (Array.isArray(data?.data) ? data.data : []);
  
  // Client-side filtering and pagination
  const filteredProducts = search 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        (typeof product.category === 'object' && product.category !== null 
          ? (product.category as { name: string }).name.toLowerCase().includes(search.toLowerCase())
          : product.category.toLowerCase().includes(search.toLowerCase()))
      )
    : allProducts;
  
  // Client-side pagination
  const itemsPerPage = 12;
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const products = filteredProducts.slice(startIndex, endIndex);
  
  const pagination = {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage
  };
  
  console.log('CategoryPage - Extracted products:', products);
  console.log('CategoryPage - Extracted pagination:', pagination);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  if (!category || !categoryData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Category Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The category you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="nav-link">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="text-4xl mr-3">{categoryData.icon}</span>
              {categoryData.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {categoryData.description}
            </p>
          </div>
        </div>
        
        {/* View Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search in ${categoryData.name}...`}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input w-full"
            />
          </div>
        </div>
        <Button variant="outline" className="nav-link">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {pagination ? (
            <>
              Showing {products.length} of {pagination.totalItems} products
              {search && ` for "${search}"`}
            </>
          ) : (
            'Loading...'
          )}
        </p>
        
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Debug Info */}
      {import.meta.env.DEV && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <p>Category: {category}</p>
          <p>Products found: {products.length}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? 'Yes' : 'No'}</p>
        </div>
      )}

      {/* Products Grid */}
      <ProductGrid
        products={products}
        loading={isLoading}
        error={error instanceof Error ? error.message : null}
        viewMode={viewMode}
      />
    </div>
  );
};
