import React, { useState } from 'react';
import { 
  ChevronRight, 
  Filter, 
  Grid, 
  List,
  Heart,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// MALUA ACTIVEWEAR Category Page Wireframe (e.g., "Leggings")
export const MaluaActivewearCategory: React.FC = () => {
  const [sortBy, setSortBy] = useState('best-selling');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Navy', value: 'navy', hex: '#1e3a8a' },
    { name: 'Sage', value: 'sage', hex: '#5f735f' },
    { name: 'Terracotta', value: 'terracotta', hex: '#d65f3a' },
    { name: 'Pink', value: 'pink', hex: '#ec4899' },
  ];

  const collections = ['Performance', 'Everyday', 'Limited Edition'];

  // Mock products
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Infinity High-Waist Legging ${i + 1}`,
    price: 8900 + (i * 500),
    image: '/api/placeholder/300/400',
    badge: i < 3 ? 'Best Seller' : i === 3 ? 'New' : null,
  }));

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-gray-500 hover:text-pink-600">Home</a>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <a href="/shop" className="text-gray-500 hover:text-pink-600">Shop</a>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">Leggings</span>
            </nav>

            {/* Title & Count */}
            <div className="text-center">
              <h1 className="text-3xl font-light text-gray-900">Leggings</h1>
              <p className="text-gray-600">24 products</p>
            </div>

            {/* Sort & View */}
            <div className="flex items-center space-x-4">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="best-selling">Best Selling</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="newest">Newest</option>
                <option value="name">Name A-Z</option>
              </select>
              
              <div className="flex border border-gray-300 rounded">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>

              {/* Category */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-gray-700">Leggings</span>
                  </label>
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-2 text-sm border rounded transition-colors ${
                        selectedSizes.includes(size)
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => toggleColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColors.includes(color.value)
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₡{priceRange[0]}</span>
                    <span>₡{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Collection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Collection</h4>
                <div className="space-y-2">
                  {collections.map(collection => (
                    <label key={collection} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">{collection}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Clear All
              </Button>
            </div>
          </div>

          {/* Right Side - Product Grid */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="group">
                    <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg mb-4 overflow-hidden">
                      {product.badge && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                            {product.badge}
                          </span>
                        </div>
                      )}
                      
                      {/* Quick Actions */}
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col space-y-2">
                          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                            <Heart className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Add Button */}
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Quick Add
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      ₡{product.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg group">
                    <div className="w-24 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded flex-shrink-0">
                      {product.badge && (
                        <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded m-2 inline-block">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-lg font-semibold text-gray-900 mb-4">
                        ₡{product.price.toLocaleString()}
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Quick View
                        </Button>
                        <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Bag
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
