import React, { useState, useRef, useEffect, useCallback } from 'react';

interface EnhancedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError,
  sizes = '100vw',
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Note: WebP/AVIF support detection removed for now
  // This would be used in production with a CDN service

  // Generate optimized image URL
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (!originalSrc || originalSrc.startsWith('data:')) return originalSrc;

    // For external images, we could add CDN parameters here
    // For now, we'll use the original URL but this is where you'd add:
    // - Width/height parameters
    // - Quality parameters
    // - Format conversion
    // - CDN optimization
    
    return originalSrc;
  }, []);

  const loadImage = useCallback(() => {
    const optimizedSrc = getOptimizedSrc(src);
    
    const img = new Image();
    
    // Set fetch priority for critical images
    if (loading === 'eager') {
      img.fetchPriority = 'high';
    }

    img.onload = () => {
      setImageSrc(optimizedSrc);
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      onError?.();
    };
    
    img.src = optimizedSrc;
  }, [src, loading, onLoad, onError, getOptimizedSrc]);

  useEffect(() => {
    if (!src) return;

    // Reset loading state when src changes
    setIsLoaded(false);
    setHasError(false);
    setImageSrc(placeholder);

    // If loading is eager, load immediately
    if (loading === 'eager') {
      loadImage();
      return;
    }

    // For lazy loading, use Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Increased margin for better UX
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, loading, loadImage, placeholder]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${!isLoaded ? 'animate-pulse' : ''} ${
        hasError ? 'opacity-50' : ''
      }`}
      loading={loading}
      sizes={sizes}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.7,
      }}
    />
  );
};
