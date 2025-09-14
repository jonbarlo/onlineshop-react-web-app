import { useEffect, useState } from 'react';

interface UseImagePreloaderOptions {
  images: string[];
  preloadCount?: number;
  priority?: boolean;
}

export const useImagePreloader = ({ 
  images, 
  preloadCount = 3, 
  priority = false 
}: UseImagePreloaderOptions) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!images.length) return;

    const imagesToPreload = images.slice(0, preloadCount);
    
    imagesToPreload.forEach((imageUrl) => {
      if (loadedImages.has(imageUrl) || loadingImages.has(imageUrl)) return;

      setLoadingImages(prev => new Set(prev).add(imageUrl));

      const img = new Image();
      
      if (priority) {
        img.fetchPriority = 'high';
      }

      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(imageUrl));
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageUrl);
          return newSet;
        });
      };

      img.onerror = () => {
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageUrl);
          return newSet;
        });
      };

      img.src = imageUrl;
    });
  }, [images, preloadCount, priority, loadedImages, loadingImages]);

  return {
    loadedImages,
    loadingImages,
    isImageLoaded: (url: string) => loadedImages.has(url),
    isImageLoading: (url: string) => loadingImages.has(url),
  };
};
