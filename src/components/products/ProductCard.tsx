import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Heart, Star } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useCartContext } from '@/contexts/CartContext';
import { formatCurrency } from '@/config/app';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean; // Hide low stock warning when used in admin context
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin = false }) => {
  const { addToCart, getItemQuantity, cart } = useCartContext();
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    shouldShowArrows: availableImages.length > 1,
    productQuantity: product.quantity,
    variants: product.variants,
    variantsLength: product.variants?.length || 0
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
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-t-2xl">
            <OptimizedImage
              src={product.imageUrl}
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
        
        {/* Low Stock Warning - only show in non-admin context */}
        {!isAdmin && (() => {
          // Calculate total available quantity from variants
          const totalVariantQuantity = product.variants?.reduce((total, variant) => total + (variant.quantity || 0), 0) || 0;
          const displayQuantity = product.variants && product.variants.length > 0 ? totalVariantQuantity : product.quantity;
          
          return product.status === 'available' && displayQuantity <= 5 && displayQuantity > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-amber-500/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
{t('admin.qty')}: {displayQuantity} • {t('admin.low_stock_alert')}
              </div>
            </div>
          );
        })()}
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
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
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
                        {!variant.color.startsWith('#') && variant.color} - {variant.size} • {t('admin.qty')}: {variant.quantity}
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
                          {!color.startsWith('#') && color}
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
          {product.status === 'available' && (() => {
            // Calculate total available quantity from variants
            const totalVariantQuantity = product.variants?.reduce((total, variant) => total + (variant.quantity || 0), 0) || 0;
            const displayQuantity = product.variants && product.variants.length > 0 ? totalVariantQuantity : product.quantity;
            
            return (
              <div className="mb-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {displayQuantity > 10 ? 'In Stock' : `${displayQuantity} in stock`}
                </span>
              </div>
            );
          })()}
          
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
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </Link>
    </div>
  );
};
