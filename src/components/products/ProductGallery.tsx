import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { apiService } from '@/services/api';
import { Image, ProductImagesSummary } from '@/types';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface ProductGalleryProps {
  productId: number;
  fallbackImageUrl?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  showFullscreen?: boolean;
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  productId,
  fallbackImageUrl,
  showThumbnails = true,
  autoPlay = false,
  showFullscreen = true,
  className = ''
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [primaryImage, setPrimaryImage] = useState<Image | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch product images
  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data: ProductImagesSummary = await apiService.getProductImages(productId);
      setImages(data.images || []);
      setPrimaryImage(data.primaryImage);
      
      // Set initial index to primary image or first image
      if (data.primaryImage) {
        const primaryIndex = data.images?.findIndex(img => img.id === data.primaryImage?.id) || 0;
        setCurrentIndex(Math.max(0, primaryIndex));
      } else if (data.images && data.images.length > 0) {
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to fetch product images:', err);
      setError('Failed to load images');
      setImages([]);
      setPrimaryImage(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Preload all gallery images for better UX
  const imageUrls = images.map(img => img.imageUrl);
  useImagePreloader({
    images: imageUrls,
    preloadCount: images.length, // Preload all gallery images
    priority: true // High priority for gallery images
  });

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, images.length]);

  // Touch/swipe gesture handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      // Swipe left - next image
      setCurrentIndex(prev => (prev + 1) % images.length);
    }
    if (isRightSwipe && images.length > 1) {
      // Swipe right - previous image
      setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    }
  };

  const goToPrevious = () => {
    if (images.length > 1) {
      setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    }
  };

  const goToNext = () => {
    if (images.length > 1) {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    if (showFullscreen) {
      setIsFullscreen(true);
    }
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            goToPrevious();
            break;
          case 'ArrowRight':
            goToNext();
            break;
          case 'Escape':
            closeFullscreen();
            break;
        }
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen, images.length]);

  // Get current image or fallback
  const getCurrentImage = (): Image | null => {
    if (images.length > 0 && currentIndex < images.length) {
      return images[currentIndex];
    }
    if (primaryImage) {
      return primaryImage;
    }
    if (fallbackImageUrl) {
      return {
        id: -1,
        productId,
        imageUrl: fallbackImageUrl,
        altText: 'Product image',
        sortOrder: 0,
        isPrimary: true,
        isActive: true,
        createdAt: '',
        updatedAt: ''
      };
    }
    return null;
  };

  const currentImage = getCurrentImage();

  if (isLoading) {
    return (
      <div className={`product-gallery ${className}`}>
        <div className="main-image-container">
          <div className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !currentImage) {
    return (
      <div className={`product-gallery ${className}`}>
        <div className="main-image-container">
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-sm mb-2">No image available</div>
              {error && <div className="text-xs text-red-500">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`product-gallery ${className}`}>
        <div className="main-image-container relative">
          <div
            className="main-image aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={openFullscreen}
          >
            <OptimizedImage
              src={currentImage.imageUrl}
              alt={currentImage.altText || 'Product image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  className="nav-arrow prev absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="nav-arrow next absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Fullscreen button */}
            {showFullscreen && images.length > 0 && (
              <button
                className="fullscreen-btn absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  openFullscreen();
                }}
                aria-label="View fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/20 text-white px-2 py-1 rounded text-xs">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail navigation */}
        {showThumbnails && images.length > 1 && (
          <div className="thumbnails-container mt-4">
            <div className="thumbnails flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  className={`thumbnail flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => goToImage(index)}
                >
                  <OptimizedImage
                    src={image.imageUrl}
                    alt={image.altText || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-200"
              onClick={closeFullscreen}
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-full">
              <OptimizedImage
                src={currentImage.imageUrl}
                alt={currentImage.altText || 'Product image'}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200"
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Fullscreen thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex gap-2 bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      className={`w-12 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                        index === currentIndex
                          ? 'border-white'
                          : 'border-white/50 hover:border-white/80'
                      }`}
                      onClick={() => goToImage(index)}
                    >
                      <OptimizedImage
                        src={image.imageUrl}
                        alt={image.altText || `Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
