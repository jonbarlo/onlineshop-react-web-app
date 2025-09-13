import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X } from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { UpdateProductRequest, Category } from '@/types';

export const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  console.log('ProductEdit - URL ID from useParams:', id);
  console.log('ProductEdit - Current URL:', window.location.href);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  // Fetch categories from database
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    ['categories'],
    () => apiService.getCategories(),
    { keepPreviousData: true, staleTime: 15 * 60 * 1000 }
  );

  const categories = categoriesData?.data || [];

  const { data, isLoading, error } = useQuery(
    ['admin-product', id],
    () => apiService.getAdminProduct(Number(id)),
    {
      enabled: !!id,
      onSuccess: (response) => {
        console.log('ProductEdit - API Response received:', response);
        console.log('ProductEdit - Product data:', response.data);
        console.log('ProductEdit - Category from API:', response.data?.category);
      }
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateProductRequest>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      isActive: true,
      quantity: 0,
    },
  });

  // Watch form values for debugging
  const watchedValues = watch();
  console.log('ProductEdit - Current form values:', watchedValues);
  console.log('ProductEdit - Category value:', watchedValues.category);

  // Reset form when product data loads
  React.useEffect(() => {
    if (data?.data) {
      const product = data.data;
      console.log('ProductEdit - Loading product data:', product);
      console.log('ProductEdit - Product category value:', product.category);
      console.log('ProductEdit - Product category type:', typeof product.category);
      setImageUrl(product.imageUrl);
      
      // Reset form with all values - handle category object
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: (typeof product.category === 'object' && product.category !== null) ? (product.category as any).slug : product.category || '',
        isActive: product.isActive,
        quantity: product.quantity,
      });
      
      console.log('ProductEdit - Form reset with category:', product.category);
    }
  }, [data, reset]);

  // Additional effect to ensure category is set after form reset
  React.useEffect(() => {
    if (data?.data) {
      // Use setTimeout to ensure this runs after the reset
      setTimeout(() => {
        const categoryValue = data.data ? ((typeof data.data.category === 'object' && data.data.category !== null) ? (data.data.category as any).slug : data.data.category) || '' : '';
        setValue('category', categoryValue);
        console.log('ProductEdit - Category setValue called with:', categoryValue);
      }, 100);
    }
  }, [data, setValue]);

  const updateProductMutation = useMutation(
    (productData: UpdateProductRequest) => apiService.updateProduct(Number(id), productData),
    {
      onSuccess: (response) => {
        console.log('ProductEdit - Update successful, response:', response);
        console.log('ProductEdit - Invalidating queries...');
        
        // Invalidate all related queries more aggressively
        queryClient.invalidateQueries(['product', id]);
        queryClient.invalidateQueries(['admin-products']);
        queryClient.invalidateQueries(['products']);
        queryClient.invalidateQueries(['products', 'category']);
        
        // Force refetch of the products list
        queryClient.refetchQueries(['admin-products']);
        
        // Wait a moment for cache to update before navigating
        setTimeout(() => {
          console.log('ProductEdit - Navigating to products list');
          navigate('/admin/products');
        }, 100);
      },
      onError: (error: any) => {
        console.log('ProductEdit - Update failed, error:', error);
        setSubmitError(error.response?.data?.message || 'Failed to update product');
      },
    }
  );

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    setValue('imageUrl', url);
  };

  const onSubmit = async (data: UpdateProductRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    console.log('ProductEdit - Form data being submitted:', data);
    
    try {
      await updateProductMutation.mutateAsync(data);
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsSubmitting(false);
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
      <div className="max-w-2xl mx-auto">
        <Alert type="error" title="Product not found">
          The product you're trying to edit doesn't exist or has been removed.
          <br />
          <br />
          Available products: 1, 2, 3, 4
        </Alert>
        <div className="mt-6">
          <Button onClick={() => navigate('/admin/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <Alert type="error" title="Product not found">
        The requested product could not be found.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/products')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Edit Product</h1>
          <p className="text-secondary-600">Update product information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <Alert type="error" title="Update Failed">
                {submitError}
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Product Name *
                  </label>
                  <FormInput
                    {...register('name', { required: 'Product name is required' })}
                    placeholder="Enter product name"
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Price *
                  </label>
                  <FormInput
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0.01, message: 'Price must be greater than 0' }
                    })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    error={errors.price?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Stock Quantity *
                  </label>
                  <FormInput
                    {...register('quantity', { 
                      required: 'Stock quantity is required',
                      min: { value: 0, message: 'Quantity must be 0 or greater' }
                    })}
                    type="number"
                    min="0"
                    placeholder="0"
                    error={errors.quantity?.message}
                  />
                  <p className="mt-1 text-xs text-secondary-500">
                    Set to 0 to mark as sold out
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category *
                    {watchedValues.category && (
                      <span className="ml-2 text-sm text-green-600 font-normal">
                        (Current: {typeof watchedValues.category === 'object' && watchedValues.category !== null ? (watchedValues.category as any).name : watchedValues.category})
                      </span>
                    )}
                  </label>
                  {categoriesLoading ? (
                    <div className="w-full px-3 py-2 border border-secondary-300 rounded-md bg-gray-50 animate-pulse">
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      value={typeof watchedValues.category === 'object' && watchedValues.category !== null ? (watchedValues.category as any).slug || '' : watchedValues.category || ''}
                      onChange={(e) => setValue('category', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category: Category) => (
                        <option key={category._id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {!watchedValues.category && (
                    <p className="mt-1 text-sm text-error-600">Category is required</p>
                  )}
                </div>

                <ImageUpload
                  value={imageUrl}
                  onChange={handleImageChange}
                  onError={setSubmitError}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter product description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      {...register('isActive')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="text-sm font-medium text-secondary-700">
                      Product is active
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/products')}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
