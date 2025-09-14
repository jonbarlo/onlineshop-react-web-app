import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { 
  Upload, 
  Trash2, 
  Edit2, 
  Star, 
  StarOff, 
  Move, 
  EyeOff,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Image, CreateImageData, UpdateImageData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
// import { useTranslation } from 'react-i18next'; // TODO: Add translations later

interface AdminImageManagerProps {
  productId: number;
  onImagesChange?: (images: Image[]) => void;
}


interface EditImageData {
  id: number;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  isActive: boolean;
}

export const AdminImageManager: React.FC<AdminImageManagerProps> = ({
  productId,
  onImagesChange
}) => {
  // const { t } = useTranslation(); // TODO: Add translations later
  const queryClient = useQueryClient();
  
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Edit form state
  const [editingImage, setEditingImage] = useState<EditImageData | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Confirmation dialogs
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [setPrimaryConfirm, setSetPrimaryConfirm] = useState<number | null>(null);
  
  // View options
  const [showInactiveImages, setShowInactiveImages] = useState(false);

  // Fetch images
  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedImages = await apiService.getAdminProductImages(productId);
      setImages(fetchedImages);
      onImagesChange?.(fetchedImages);
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  }, [productId, onImagesChange]);

  useEffect(() => {
    fetchImages();
  }, [productId, fetchImages]);

  // File upload validation
  const validateFile = (file: File): string | null => {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, GIF, and WebP files are allowed';
    }

    return null;
  };

  // File upload handling
  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload the file first
      const uploadResponse = await apiService.uploadProductImage(file);
      const imageUrl = uploadResponse.data.imageUrl;

      // Then add it to the product
      const imageData: CreateImageData = {
        imageUrl: imageUrl,
        altText: file.name.split('.')[0] || 'Product image', // Use filename as default alt text
        sortOrder: images.length,
        isPrimary: images.length === 0 // First image becomes primary
      };

      await addImageMutation.mutateAsync(imageData);
      
    } catch (err) {
      console.error('Failed to upload file:', err);
      setUploadError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // Add image mutation
  const addImageMutation = useMutation(
    (imageData: CreateImageData) => apiService.addProductImage(productId, imageData),
    {
      onSuccess: () => {
        fetchImages();
        queryClient.invalidateQueries(['product', productId]);
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      onError: (err) => {
        console.error('Failed to add image:', err);
        setError('Failed to add image');
      }
    }
  );

  // Update image mutation
  const updateImageMutation = useMutation(
    ({ imageId, updates }: { imageId: number; updates: UpdateImageData }) =>
      apiService.updateProductImage(productId, imageId, updates),
    {
      onSuccess: () => {
        fetchImages();
        setShowEditForm(false);
        setEditingImage(null);
        queryClient.invalidateQueries(['product', productId]);
      },
      onError: (err) => {
        console.error('Failed to update image:', err);
        setError('Failed to update image');
      }
    }
  );

  // Delete image mutation
  const deleteImageMutation = useMutation(
    (imageId: number) => apiService.deleteProductImageById(productId, imageId),
    {
      onSuccess: () => {
        fetchImages();
        setDeleteConfirm(null);
        queryClient.invalidateQueries(['product', productId]);
      },
      onError: (err) => {
        console.error('Failed to delete image:', err);
        setError('Failed to delete image');
      }
    }
  );

  // Reorder images mutation
  const reorderImagesMutation = useMutation(
    (imageIds: number[]) => apiService.reorderProductImages(productId, imageIds),
    {
      onSuccess: () => {
        fetchImages();
        queryClient.invalidateQueries(['product', productId]);
      },
      onError: (err) => {
        console.error('Failed to reorder images:', err);
        setError('Failed to reorder images');
      }
    }
  );

  // Handlers

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    const updates: UpdateImageData = {
      altText: editingImage.altText.trim() || 'Product image',
      sortOrder: editingImage.sortOrder,
      isPrimary: editingImage.isPrimary,
      isActive: editingImage.isActive
    };

    updateImageMutation.mutate({
      imageId: editingImage.id,
      updates
    });
  };

  const handleDeleteImage = (imageId: number) => {
    deleteImageMutation.mutate(imageId);
  };

  const handleSetPrimary = async (imageId: number) => {
    const updates: UpdateImageData = { isPrimary: true };
    updateImageMutation.mutate({ imageId, updates });
    setSetPrimaryConfirm(null);
  };

  const handleMoveImage = (imageId: number, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[currentIndex], newImages[newIndex]] = [newImages[newIndex], newImages[currentIndex]];
    
    // Update sort orders
    newImages.forEach((img, index) => {
      img.sortOrder = index;
    });

    const imageIds = newImages.map(img => img.id);
    reorderImagesMutation.mutate(imageIds);
  };

  const startEditImage = (image: Image) => {
    setEditingImage({
      id: image.id,
      altText: image.altText,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
      isActive: image.isActive
    });
    setShowEditForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Images</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading images...</span>
        </div>
      </div>
    );
  }

  // Filter images based on showInactiveImages setting
  const filteredImages = showInactiveImages ? images : images.filter(img => img.isActive);
  const activeImagesCount = images.filter(img => img.isActive).length;
  const inactiveImagesCount = images.filter(img => !img.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Product Images ({activeImagesCount} active{inactiveImagesCount > 0 ? `, ${inactiveImagesCount} hidden` : ''})
          </h3>
          {inactiveImagesCount > 0 && (
            <button
              onClick={() => setShowInactiveImages(!showInactiveImages)}
              className="text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              {showInactiveImages ? 'Hide' : 'Show'} hidden images
            </button>
          )}
        </div>
      </div>

      {error && (
        <Alert type="error" title="Error">
          {error}
        </Alert>
      )}

      {/* File Upload Interface */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300">
          Add New Image
        </label>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-secondary-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClickUpload}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-secondary-600 dark:text-gray-400">
                Uploading image...
              </p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Upload Error */}
        {uploadError && (
          <Alert type="error" title="Upload Error">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {uploadError}
            </div>
          </Alert>
        )}
      </div>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-gray-500 mb-4">
            {images.length === 0 ? 'No images uploaded yet' : 'No active images to display'}
          </div>
          <p className="text-sm text-gray-400">
            {images.length === 0 
              ? 'Use the upload area above to add your first image'
              : 'All images are currently hidden. Use the toggle above to show them or edit images to make them active.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => {
            const originalIndex = images.findIndex(img => img.id === image.id);
            return (
            <div
              key={image.id}
              className={`relative border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                image.isPrimary ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
              } ${!image.isActive ? 'opacity-60' : ''}`}
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative">
                <OptimizedImage
                  src={image.imageUrl}
                  alt={image.altText}
                  className="w-full h-full object-cover"
                  onError={() => {
                    console.warn(`Failed to load image: ${image.imageUrl}`);
                  }}
                />
                {/* Image error overlay */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs">Image not found</p>
                    <p className="text-xs">Click edit to fix</p>
                  </div>
                </div>
              </div>

              {/* Delete button - top right */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-10 w-10 p-0 bg-red-500/90 hover:bg-red-600 text-white hover:text-white"
                onClick={() => setDeleteConfirm(image.id)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>

              {/* Primary badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Primary
                </div>
              )}

              {/* Inactive badge */}
              {!image.isActive && (
                <div className="absolute top-12 left-2 bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  Hidden
                </div>
              )}

              {/* Sort order */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                #{image.sortOrder + 1}
              </div>

              {/* Actions */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={() => startEditImage(image)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                
                {!image.isPrimary && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={() => setSetPrimaryConfirm(image.id)}
                  >
                    <StarOff className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Move buttons */}
              <div className="absolute top-12 right-2 flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
                  onClick={() => handleMoveImage(image.id, 'up')}
                  disabled={originalIndex === 0}
                >
                  <Move className="w-3 h-3 rotate-180" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
                  onClick={() => handleMoveImage(image.id, 'down')}
                  disabled={originalIndex === images.length - 1}
                >
                  <Move className="w-3 h-3" />
                </Button>
              </div>

              {/* Alt text preview */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="text-white text-xs truncate">
                  {image.altText}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}


      {/* Edit Form Modal */}
      <Modal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Edit Image"
        size="md"
      >
        {editingImage && (
          <div className="space-y-4">
            <Input
              label="Alt Text"
              value={editingImage.altText}
              onChange={(value) => setEditingImage(prev => prev ? { ...prev, altText: value } : null)}
              placeholder="Description of the image"
            />
            
            <div className="flex items-center space-x-4">
              <Input
                label="Sort Order"
                type="number"
                value={editingImage.sortOrder.toString()}
                onChange={(value) => setEditingImage(prev => prev ? { ...prev, sortOrder: parseInt(value) || 0 } : null)}
                placeholder="0"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsPrimary"
                  checked={editingImage.isPrimary}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, isPrimary: e.target.checked } : null)}
                  className="mr-2"
                />
                <label htmlFor="editIsPrimary" className="text-sm font-medium">
                  Primary image
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingImage.isActive}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium">
                  Visible to customers
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditForm(false)}
                disabled={updateImageMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateImage}
                disabled={updateImageMutation.isLoading}
              >
                {updateImageMutation.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Image"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-medium">Are you sure you want to delete this image?</p>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleteImageMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={() => deleteConfirm && handleDeleteImage(deleteConfirm)}
              disabled={deleteImageMutation.isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {deleteImageMutation.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Set Primary Confirmation Modal */}
      <Modal
        isOpen={setPrimaryConfirm !== null}
        onClose={() => setSetPrimaryConfirm(null)}
        title="Set Primary Image"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="font-medium">Set this image as the primary image?</p>
              <p className="text-sm text-gray-600">This will be the main image shown to customers.</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setSetPrimaryConfirm(null)}
              disabled={updateImageMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setPrimaryConfirm && handleSetPrimary(setPrimaryConfirm)}
              disabled={updateImageMutation.isLoading}
            >
              {updateImageMutation.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Star className="w-4 h-4 mr-2" />
              )}
              Set Primary
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
