import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X } from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { UpdateProductRequest } from '@/types';

export const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => apiService.getProduct(Number(id)),
    {
      enabled: !!id,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProductRequest>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      isActive: true,
    },
  });

  // Reset form when product data loads
  React.useEffect(() => {
    if (data?.data) {
      const product = data.data;
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
      });
    }
  }, [data, reset]);

  const updateProductMutation = useMutation(
    (productData: UpdateProductRequest) => apiService.updateProduct(Number(id), productData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['product', id]);
        queryClient.invalidateQueries(['admin-products']);
        navigate('/admin/products');
      },
      onError: (error: any) => {
        setSubmitError(error.response?.data?.message || 'Failed to update product');
      },
    }
  );

  const onSubmit = async (data: UpdateProductRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
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
      <Alert type="error" title="Failed to load product">
        Unable to load product details. Please try again later.
      </Alert>
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
          <h1 className="text-3xl font-bold text-secondary-900">Edit Product</h1>
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
                    Image URL
                  </label>
                  <FormInput
                    {...register('imageUrl')}
                    placeholder="https://example.com/image.jpg"
                    error={errors.imageUrl?.message}
                  />
                </div>
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
