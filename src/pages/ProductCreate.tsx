import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { ProductVariantManager } from '@/components/admin/ProductVariantManager';
import { CreateProductRequest, Category, ProductVariant } from '@/types';
import { AdminImageManager } from '@/components/admin/AdminImageManager';

export const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [tempImages, setTempImages] = useState<string[]>([]); // Store uploaded image URLs temporarily

  // Fetch categories from database
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    ['categories'],
    () => apiService.getCategories(),
    { keepPreviousData: true, staleTime: 15 * 60 * 1000 }
  );

  const categories = categoriesData?.data || [];
  
  // Debug logging
  console.log('Categories data:', categoriesData);
  console.log('Categories array:', categories);
  console.log('First category:', categories[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductRequest>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: 0,
      quantity: 0,
    },
  });
  
  // Variant management state
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const createProductMutation = useMutation(
    (productData: CreateProductRequest) => apiService.createProduct(productData),
    {
      onSuccess: async (response) => {
        const newProductId = response.data?.id;
        if (newProductId) {
          setCreatedProductId(newProductId);
          
          // Add all temporary images to the new product
          if (tempImages.length > 0) {
            try {
              for (let i = 0; i < tempImages.length; i++) {
                const imageUrl = tempImages[i];
                await apiService.addProductImage(newProductId, {
                  imageUrl: imageUrl,
                  altText: `Product image ${i + 1}`,
                  sortOrder: i,
                  isPrimary: i === 0 // First image becomes primary
                });
              }
            } catch (error) {
              console.error('Failed to add images to product:', error);
              // Don't fail the whole process if image addition fails
            }
          }
        }
        queryClient.invalidateQueries(['admin-products']);
        queryClient.invalidateQueries(['products']);
      },
      onError: (error: unknown) => {
        console.error('Product creation mutation error:', error);
        
        // Type guard for axios error
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string; error?: string; details?: string } } };
          console.error('Error response data:', axiosError.response?.data);
        }
        
        // Type guard for Error instance
        let errorMessage = 'Failed to create product';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string; error?: string; details?: string } } };
          errorMessage = axiosError.response?.data?.message || 
                        axiosError.response?.data?.error || 
                        axiosError.response?.data?.details ||
                        'Failed to create product';
        }
        
        setSubmitError(errorMessage);
      },
    }
  );


  // Handle temporary image uploads (before product creation)
  const handleTempImageUpload = async (file: File) => {
    try {
      const response = await apiService.uploadProductImage(file);
      const imageUrl = response.data.imageUrl;
      setTempImages(prev => [...prev, imageUrl]);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setSubmitError('Failed to upload image');
    }
  };

  const onSubmit = async (data: CreateProductRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Validate required fields
      if (!data.name.trim()) {
        setSubmitError('Product name is required');
        return;
      }
      if (!data.description.trim()) {
        setSubmitError('Product description is required');
        return;
      }
      if (data.description.trim().length < 10) {
        setSubmitError('Product description must be at least 10 characters long');
        return;
      }
      if (!data.categoryId || data.categoryId === 0) {
        setSubmitError('Please select a category');
        return;
      }
      if (data.price <= 0) {
        setSubmitError('Price must be greater than 0');
        return;
      }
      if (data.quantity < 0) {
        setSubmitError('Quantity cannot be negative');
        return;
      }
      
      // Convert price to number and ensure proper data types
      const productData: CreateProductRequest = {
        ...data,
        name: data.name.trim(),
        description: data.description.trim(),
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        categoryId: typeof data.categoryId === 'string' ? parseInt(data.categoryId) : data.categoryId,
        quantity: typeof data.quantity === 'string' ? parseInt(data.quantity) : data.quantity,
        variants: variants,
      };
      
      console.log('Creating product with data:', productData);
      console.log('ProductCreate - Variants:', productData.variants);
      await createProductMutation.mutateAsync(productData);
    } catch (error) {
      console.error('Product creation error:', error);
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

                <div className="col-span-2">
                  <ProductVariantManager
                    variants={variants}
                    onChange={setVariants}
                  />
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
                      {...register('categoryId', { required: 'Category is required' })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      defaultValue=""
                    >
                      <option value="">Select a category</option>
                      {categories.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-error-600">{errors.categoryId.message}</p>
                  )}
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

      {/* Temporary Multiple Images Upload - Show before product creation */}
      {!createdProductId && (
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-secondary-600">
                Upload multiple images for your product. The first image will be used as the main product image.
              </p>
              
              {/* Temporary Images Preview */}
              {tempImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tempImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-secondary-200"
                      />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                          Primary
                        </div>
                      )}
                      <button
                        onClick={() => setTempImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File Upload Interface */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300">
                  Add Images
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleTempImageUpload(files[0]);
                    }
                  }}
                  className="hidden"
                  id="temp-image-upload"
                />

                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-secondary-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 rounded-lg p-6 text-center transition-colors cursor-pointer"
                  onClick={() => document.getElementById('temp-image-upload')?.click()}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-secondary-100 dark:bg-gray-700 rounded-full">
                      <Upload className="h-6 w-6 text-secondary-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-gray-400">
                        PNG, JPG, GIF, WebP up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multiple Images Management - Show after product is created */}
      {createdProductId && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Alert type="success" title="Product Created Successfully">
                Your product has been created. You can now add multiple images to enhance the product display.
              </Alert>
            </div>
            <AdminImageManager 
              productId={createdProductId} 
              onImagesChange={(images) => {
                console.log('Images updated:', images);
              }}
            />
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/products')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <Button
                onClick={() => navigate('/admin/products')}
              >
                View All Products
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
