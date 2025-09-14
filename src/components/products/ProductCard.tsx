import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useCartContext } from '@/contexts/CartContext';
import { formatCurrency } from '@/config/app';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getItemQuantity, cart } = useCartContext();
  const { t } = useTranslation();
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Update quantity when cart changes
  useEffect(() => {
    const quantity = getItemQuantity(product.id);
    setQuantityInCart(quantity);
  }, [cart.items, product.id, getItemQuantity]);

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('ProductCard: Adding to cart:', product.name);
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Get current image based on currentImageIndex
  const getCurrentImage = () => {
    const availableImages = getAvailableImages();
    if (availableImages.length > 0) {
      return availableImages[currentImageIndex]?.imageUrl || availableImages[0].imageUrl;
    }
    return product.imageUrl || '/placeholder-image.jpg';
  };

  const getAvailableImages = () => {
    console.log('🔍 getAvailableImages - product.images:', product.images);
    console.log('🔍 getAvailableImages - product.images length:', product.images?.length);
    
    if (product.images && product.images.length > 0) {
      // First try to get active images
      const activeImages = product.images.filter(img => img.isActive);
      console.log('🔍 getAvailableImages - activeImages:', activeImages);
      console.log('🔍 getAvailableImages - activeImages length:', activeImages.length);
      
      if (activeImages.length > 0) {
        console.log('🔍 getAvailableImages - returning activeImages');
        return activeImages;
      }
      // Fallback: if no active images, use all images
      console.log('🔍 getAvailableImages - no active images, returning all images');
      return product.images;
    }
    console.log('🔍 getAvailableImages - no images, returning empty array');
    return [];
  };

  const availableImages = getAvailableImages();
  const currentImage = getCurrentImage();

  // Debug logging
  console.log('ProductCard Debug:', {
    productId: product.id,
    productName: product.name,
    hasImages: !!product.images,
    imagesLength: product.images?.length || 0,
    allImages: product.images,
    availableImages: availableImages,
    availableImagesLength: availableImages.length,
    currentImageIndex,
    currentImage,
    shouldShowArrows: availableImages.length > 1
  });

  // Preload next few images for better UX
  const imageUrls = availableImages.map(img => img.imageUrl);
  useImagePreloader({
    images: imageUrls,
    preloadCount: 3,
    priority: false
  });

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? availableImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === availableImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={`product-card group relative ${
      product.status === 'sold_out' 
        ? 'opacity-60 hover:opacity-80 transition-all duration-300' 
        : ''
    }`}>
      <div className="relative">
        <Link to={`/products/${product.id}`} className="block">
          <div 
            className="aspect-square overflow-hidden rounded-t-2xl relative"
            onClick={() => {
              console.log('🖼️ Image clicked - navigating to product detail');
              console.log('🖼️ Product ID:', product.id);
              console.log('🖼️ Current image:', currentImage);
              console.log('🖼️ Available images:', availableImages);
            }}
          >
            <OptimizedImage
              key={`${product.id}-${currentImageIndex}`}
              src={currentImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                product.status === 'sold_out'
                  ? 'grayscale brightness-75 group-hover:brightness-90'
                  : 'group-hover:scale-105'
              }`}
              loading="lazy"
            />
          </div>
        </Link>
        
        {/* Navigation Arrows - only show if multiple images */}
        {availableImages.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full z-20 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full z-20 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-20 shadow-lg">
              {currentImageIndex + 1} / {availableImages.length}
            </div>
          </>
        )}
        
        {/* Sold Out Overlay */}
        {product.status === 'sold_out' && (
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent flex items-end justify-center pb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-white text-sm font-semibold">Currently Unavailable</span>
            </div>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-soft hover:bg-white hover:shadow-medium transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
        >
          <Heart 
            className={`h-4 w-4 ${
              isWishlisted 
                ? 'text-red-500 fill-current' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>

        {/* Status Badge */}
        {product.status === 'sold_out' && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gray-800/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg border border-gray-700/50">
              Sold Out
            </div>
          </div>
        )}
        
        {/* Low Stock Warning */}
        {product.status === 'available' && product.quantity <= 5 && product.quantity > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-amber-500/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
              Only {product.quantity} left!
            </div>
          </div>
        )}
      </div>
      
      <Link to={`/products/${product.id}`} className="block">
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Product Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                <span className="text-xs text-gray-500 dark:text-gray-400">Options:</span>
                <div className="flex items-center space-x-1">
                  {product.variants.slice(0, 3).map((variant, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      {variant.color.startsWith('#') ? (
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: variant.color }}
                          title={variant.color}
                        />
                      ) : null}
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {variant.color} - {variant.size}
                      </span>
                      {index < Math.min(product.variants?.length || 0, 3) - 1 && (
                        <span className="text-xs text-gray-400">,</span>
                      )}
                    </div>
                  ))}
                  {(product.variants?.length || 0) > 3 && (
                    <span className="text-xs text-gray-500">+{(product.variants?.length || 0) - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fallback: Product Attributes (for backward compatibility) */}
          {(!product.variants || product.variants.length === 0) && ((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Colors:</span>
                  <div className="flex items-center space-x-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        {color.startsWith('#') ? (
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ) : null}
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {color}
                        </span>
                        {index < Math.min(product.colors?.length || 0, 3) - 1 && (
                          <span className="text-xs text-gray-400">,</span>
                        )}
                      </div>
                    ))}
                    {(product.colors?.length || 0) > 3 && (
                      <span className="text-xs text-gray-500">+{(product.colors?.length || 0) - 3} more</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Sizes:</span>
                  <div className="flex items-center space-x-1">
                    {product.sizes.slice(0, 4).map((size, index) => (
                      <span key={index} className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {size}
                        {index < Math.min(product.sizes?.length || 0, 4) - 1 && ','}
                      </span>
                    ))}
                    {(product.sizes?.length || 0) > 4 && (
                      <span className="text-xs text-gray-500">+{(product.sizes?.length || 0) - 4} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Quantity Display */}
          {product.status === 'available' && (
            <div className="mb-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.quantity > 10 ? 'In Stock' : `${product.quantity} in stock`}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price * 1.2)}
              </span>
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-lg font-medium">
              20% OFF
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-6 pt-0">
        {product.variants && product.variants.length > 0 ? (
          <Link to={`/products/${product.id}`}>
            <Button
              className="w-full transition-all duration-200 btn-primary"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Select Options
            </Button>
          </Link>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={product.status === 'sold_out' || product.quantity === 0}
            className={`w-full transition-all duration-200 ${
              product.status === 'sold_out' 
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600' 
                : 'btn-primary'
            }`}
            size="sm"
          >
            {product.status === 'sold_out' ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Notify When Available
              </>
            ) : quantityInCart > 0 ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                In Cart ({quantityInCart})
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {t('buttons.add_to_cart')}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
