import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Grid, List } from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading, error } = useQuery(
    ['admin-products', search],
    () => apiService.getAdminProducts({
      search: search || undefined,
    }),
    {
      keepPreviousData: true,
    }
  );

  const products = data?.data || [];
  
  console.log('AdminProducts - All products:', products);
  console.log('AdminProducts - Product IDs:', products.map(p => p.id));

  const deleteProductMutation = useMutation(
    (productId: number) => apiService.deleteProduct(productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-products']);
      },
    }
  );

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        await deleteProductMutation.mutateAsync(productId);
      } catch (error) {
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Failed to load products">
        Unable to load products. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Products</h1>
          <p className="text-secondary-600">Manage your product catalog</p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and View Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={setSearch}
                  className="pl-10"
                />
              </div>
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
        </CardContent>
      </Card>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square overflow-hidden relative">
                <OptimizedImage
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                      product.status === 'sold_out'
                        ? 'bg-gray-500 text-white'
                        : product.quantity <= 5
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {product.status === 'sold_out' ? 'Sold Out' : 
                     product.quantity <= 5 ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Product Name */}
                  <h3 className="font-semibold text-secondary-900 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-secondary-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        product.isActive
                          ? 'bg-success-100 text-success-800'
                          : 'bg-error-100 text-error-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Inventory Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary-600">Stock:</span>
                      <span className={`font-medium ${
                        product.quantity === 0 ? 'text-error-600' :
                        product.quantity <= 5 ? 'text-yellow-600' :
                        'text-success-600'
                      }`}>
                        {product.quantity} units
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary-600">Status:</span>
                      <span className={`font-medium ${
                        product.status === 'sold_out' ? 'text-error-600' : 'text-success-600'
                      }`}>
                        {product.status === 'sold_out' ? 'Sold Out' : 'Available'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="text-error-600 hover:text-error-700"
                      disabled={deleteProductMutation.isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-32 h-32 flex-shrink-0">
                  <OptimizedImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {product.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            product.isActive
                              ? 'bg-success-100 text-success-800'
                              : 'bg-error-100 text-error-800'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-secondary-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-xl font-bold text-primary-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          product.status === 'sold_out'
                            ? 'bg-gray-100 text-gray-600'
                            : product.quantity <= 5
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {product.status === 'sold_out' ? 'Sold Out' : 
                           product.quantity <= 5 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-secondary-600">
                        <span>Stock: <span className="font-medium">{product.quantity} units</span></span>
                        <span>Status: <span className="font-medium">{product.status === 'sold_out' ? 'Sold Out' : 'Available'}</span></span>
                        {product.category && (
                          <span>Category: <span className="font-medium">
                            {typeof product.category === 'object' && product.category !== null ? (product.category as any).name : product.category}
                          </span></span>
                        )}
                        <span>Created: <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="text-error-600 hover:text-error-700"
                        disabled={deleteProductMutation.isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-secondary-600">No products found</p>
          </CardContent>
        </Card>
      )}

    </div>
  );
};
