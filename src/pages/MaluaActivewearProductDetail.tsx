import React, { useState } from 'react';
import { 
  ChevronRight, 
  Heart, 
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Minus,
  Plus,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

// MALUA ACTIVEWEAR Product Detail Page Wireframe
export const MaluaActivewearProductDetail: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const colors = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Navy', value: 'navy', hex: '#1e3a8a' },
    { name: 'Sage', value: 'sage', hex: '#5f735f' },
    { name: 'Terracotta', value: 'terracotta', hex: '#d65f3a' },
    { name: 'Pink', value: 'pink', hex: '#ec4899' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  
  const productImages = [
    { id: 1, type: 'front', placeholder: 'Front view' },
    { id: 2, type: 'back', placeholder: 'Back view' },
    { id: 3, type: 'detail', placeholder: 'Detail shot' },
    { id: 4, type: 'lifestyle', placeholder: 'Lifestyle shot' },
  ];

  const reviews = [
    { rating: 5, name: 'Sarah M.', comment: 'Perfect fit and so comfortable!' },
    { rating: 5, name: 'Jessica L.', comment: 'Love the fabric quality' },
    { rating: 4, name: 'Maria K.', comment: 'Great for yoga and running' },
  ];

  const relatedProducts = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: `Infinity High-Waist Legging ${i + 1}`,
    price: 8900 + (i * 500),
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-pink-600">Home</a>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <a href="/aura" className="text-gray-500 hover:text-pink-600">MALUA ACTIVEWEAR</a>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <a href="/aura/category/leggings" className="text-gray-500 hover:text-pink-600">Leggings</a>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">Infinity High-Waist Legging</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Gallery (60%) */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-pink-700 text-4xl font-bold">L</span>
                  </div>
                  <p className="text-sm text-pink-600">
                    {productImages[activeImageIndex].placeholder}
                  </p>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded border-2 transition-colors ${
                    activeImageIndex === index 
                      ? 'border-gray-900' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-pink-600 text-lg font-bold">
                      {image.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info (40%) */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Infinity High-Waist Legging
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">(127 reviews)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-semibold text-gray-900">
              ₡12,500
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Color: {colors.find(c => c.value === selectedColor)?.name}</h3>
              <div className="flex space-x-3">
                {colors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Size</h3>
                <a href="/size-guide" className="text-sm text-pink-600 hover:underline">
                  Size Guide
                </a>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded transition-colors ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg"
                disabled={!selectedSize}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Bag
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600">30-Day Returns</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600">Easy Exchanges</p>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center space-x-4 pt-6 border-t">
              <span className="text-sm text-gray-600">Share:</span>
              <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                <Share2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="space-y-4">
            {/* Description & Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Description & Details</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 mb-4">
                    The Infinity High-Waist Legging is designed for the modern athlete who demands both performance and style. 
                    Featuring our signature seamless technology and 4-way stretch fabric.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>High-waist design for full coverage and support</li>
                    <li>Moisture-wicking fabric keeps you dry</li>
                    <li>Flatlock seams prevent chafing</li>
                    <li>Machine washable, tumble dry low</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Size & Fit */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Size & Fit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Model Information</h4>
                    <p className="text-gray-700 text-sm">Model is 5'8" wearing size Medium</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Fit Notes</h4>
                    <p className="text-gray-700 text-sm">True to size. For a relaxed fit, size up.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <a href="/size-guide" className="text-pink-600 hover:underline">
                    View Full Size Guide →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Returns */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Free shipping on orders over ₡10,000</li>
                      <li>• Standard shipping: 3-5 business days</li>
                      <li>• Express shipping: 1-2 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Returns</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• 30-day return policy</li>
                      <li>• Free returns and exchanges</li>
                      <li>• Items must be unworn with tags</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">Customer Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{review.name}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-pink-600">L</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                <p className="text-lg font-semibold text-gray-900">
                  ₡{product.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
