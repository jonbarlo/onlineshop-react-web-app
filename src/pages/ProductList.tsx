import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Gamepad2, 
  ArrowRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Grid,
  List,
  Search
} from 'lucide-react';
import { apiService } from '@/services/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
  color: string;
}

const categories: Category[] = [
  { 
    id: 'electronics', 
    name: 'Electronics', 
    icon: Smartphone, 
    href: '/category/electronics',
    description: 'Latest gadgets and tech',
    color: 'from-blue-500 to-purple-600'
  },
  { 
    id: 'clothing', 
    name: 'Clothing', 
    icon: Shirt, 
    href: '/category/clothing',
    description: 'Fashion for everyone',
    color: 'from-pink-500 to-rose-600'
  },
  { 
    id: 'home', 
    name: 'Home & Garden', 
    icon: Home, 
    href: '/category/home',
    description: 'Make your house a home',
    color: 'from-green-500 to-emerald-600'
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    icon: Gamepad2, 
    href: '/category/sports',
    description: 'Gear up for adventure',
    color: 'from-orange-500 to-red-600'
  },
];

export const ProductList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  
  const { data, isLoading, error } = useQuery(
    ['products'],
    () => {
      return apiService.getProducts({
        page: 1,
        limit: 50, // Get more products for client-side filtering
      });
    },
    {
      keepPreviousData: true,
      staleTime: 15 * 60 * 1000, // 15 minutes - products don't change often
      cacheTime: 60 * 60 * 1000, // 1 hour - keep in cache longer
    }
  );

  // Handle the actual API response structure
  const allProducts = Array.isArray(data?.data) ? data.data : [];
  
  // Client-side filtering
  const products = search 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        (typeof product.category === 'object' && product.category !== null 
          ? (product.category as { name: string }).name.toLowerCase().includes(search.toLowerCase())
          : product.category.toLowerCase().includes(search.toLowerCase()))
      )
    : allProducts.slice(0, 12); // Show first 12 products when no search

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Shop 506
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-primary">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-soft">
          <Truck className="h-8 w-8 text-brand-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Delivery</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Free shipping on orders over $50</p>
        </div>
        <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-soft">
          <Shield className="h-8 w-8 text-brand-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Shopping</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your data is protected</p>
        </div>
        <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-soft">
          <RefreshCw className="h-8 w-8 text-brand-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Easy Returns</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">30-day return policy</p>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          <Button variant="ghost" className="nav-link">
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.href}
                className="category-card group"
              >
                <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Customer favorites</span>
            </div>
            
            {/* View Toggle Buttons */}
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
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-center">
              <div className="max-w-md w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products by name, description, or category..."
                    value={search}
                    onChange={setSearch}
                    className="pl-10"
                  />
                </div>
                {search && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Found {products.length} product{products.length !== 1 ? 's' : ''} matching "{search}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ProductGrid
          products={products}
          loading={isLoading}
          error={error instanceof Error ? error.message : null}
          viewMode={viewMode}
        />
      </section>
    </div>
  );
};
