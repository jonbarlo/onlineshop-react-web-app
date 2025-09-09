import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Alert } from './Alert';
import { LoadingSpinner } from './LoadingSpinner';
import { apiService } from '@/services/api';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onError,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create local preview immediately
      const localPreviewUrl = URL.createObjectURL(file);
      setLocalPreview(localPreviewUrl);
      
      const response = await apiService.uploadProductImage(file);
      console.log('Upload response:', response);
      console.log('Image URL:', response.data.imageUrl);
      
      // Update with server URL
      onChange(response.data.imageUrl);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to upload image';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setLocalPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // Cleanup local preview URL on unmount
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
        Product Image
      </label>

      {/* Image Preview */}
      {(value || localPreview) && (
        <div className="relative inline-block">
          <img
            src={localPreview || value}
            alt="Product preview"
            className="w-32 h-32 object-cover rounded-lg border border-secondary-200 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hidden File Input - Always present */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Area */}
      {!value && (
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
      )}

      {/* Upload Button (when image exists) */}
      {value && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClickUpload}
          className="flex items-center"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Change Image
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <Alert type="error" title="Upload Error">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </Alert>
      )}
    </div>
  );
};
