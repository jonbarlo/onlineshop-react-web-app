import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X } from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { CreateProductRequest, Category } from '@/types';

export const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateProductRequest>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      quantity: 0,
    },
  });

  const createProductMutation = useMutation(
    (productData: CreateProductRequest) => apiService.createProduct(productData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-products']);
        navigate('/admin/products');
      },
      onError: (error: any) => {
        setSubmitError(error.response?.data?.message || 'Failed to create product');
      },
    }
  );

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    setValue('imageUrl', url);
  };

  const onSubmit = async (data: CreateProductRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await createProductMutation.mutateAsync(data);
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Create Product</h1>
          <p className="text-secondary-600">Add a new product to your catalog</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <Alert type="error" title="Creation Failed">
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
                    Initial Stock Quantity *
                  </label>
                  <FormInput
                    {...register('quantity', { 
                      required: 'Initial stock quantity is required',
                      min: { value: 0, message: 'Quantity must be 0 or greater' }
                    })}
                    type="number"
                    min="0"
                    placeholder="0"
                    error={errors.quantity?.message}
                  />
                  <p className="mt-1 text-xs text-secondary-500">
                    Set to 0 to mark as sold out initially
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category *
                  </label>
                  {categoriesLoading ? (
                    <div className="w-full px-3 py-2 border border-secondary-300 rounded-md bg-gray-50 animate-pulse">
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category: Category) => (
                        <option key={category._id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.category && (
                    <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
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
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
