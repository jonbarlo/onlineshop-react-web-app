import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User,
  Menu,
  X,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/Button';

// MALUA ACTIVEWEAR Homepage Wireframe
export const MaluaActivewearHomepage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [searchQuery, setSearchQuery] = useState(''); // Unused for now

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch products for best sellers
  const { data: productsData, isLoading } = useQuery(
    ['products'],
    () => apiService.getProducts({ page: 1, limit: 8 }),
    { keepPreviousData: true, staleTime: 15 * 60 * 1000 }
  );

  const products = productsData?.data || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Global Header - Sticky */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold text-gray-900 tracking-wide">
                MALUA ACTIVEWEAR
              </a>
            </div>

            {/* Center Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                  Shop
                </button>
                {/* Mega Menu */}
                <div className="absolute top-full left-0 w-96 bg-white shadow-xl rounded-lg p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                      <ul className="space-y-2">
                        <li><a href="/bras" className="text-gray-600 hover:text-pink-600">Bras</a></li>
                        <li><a href="/tops" className="text-gray-600 hover:text-pink-600">Tops</a></li>
                        <li><a href="/leggings" className="text-gray-600 hover:text-pink-600">Leggings</a></li>
                        <li><a href="/shorts" className="text-gray-600 hover:text-pink-600">Shorts</a></li>
                        <li><a href="/sets" className="text-gray-600 hover:text-pink-600">Sets</a></li>
                        <li><a href="/accessories" className="text-gray-600 hover:text-pink-600">Accessories</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Collections</h3>
                      <ul className="space-y-2">
                        <li><a href="/performance" className="text-gray-600 hover:text-pink-600">Performance Line</a></li>
                        <li><a href="/studio" className="text-gray-600 hover:text-pink-600">Studio Collection</a></li>
                        <li><a href="/limited" className="text-gray-600 hover:text-pink-600">Limited Edition</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <a href="/collections" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Collections
              </a>
              <a href="/technology" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Our Technology
              </a>
              <a href="/about" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                About
              </a>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="h-5 w-5 text-gray-700 hover:text-pink-600 cursor-pointer" />
              </div>
              {/* User */}
              <User className="h-5 w-5 text-gray-700 hover:text-pink-600 cursor-pointer" />
              {/* Wishlist */}
              <Heart className="h-5 w-5 text-gray-700 hover:text-pink-600 cursor-pointer" />
              {/* Shopping Bag */}
              <div className="relative">
                <ShoppingBag className="h-5 w-5 text-gray-700 hover:text-pink-600 cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>
              {/* Mobile Menu */}
              <button 
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-40">
          <div className="px-4 py-6 space-y-4">
            <a href="/shop" className="block text-gray-700 hover:text-pink-600">Shop</a>
            <a href="/collections" className="block text-gray-700 hover:text-pink-600">Collections</a>
            <a href="/technology" className="block text-gray-700 hover:text-pink-600">Our Technology</a>
            <a href="/about" className="block text-gray-700 hover:text-pink-600">About</a>
          </div>
        </div>
      )}

      {/* Layer 1: Full-Screen Video Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-sage-50">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl lg:text-8xl font-light text-gray-900 mb-6 tracking-tight">
            Move with Intention.
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 mb-8 font-light">
            Technical wear for the modern athlete.
          </p>
          <Button 
            size="lg" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium"
          >
            Shop The Collection
          </Button>
        </div>
      </section>

      {/* Layer 2: Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Shop By Category</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category 1: Leggings */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-24 h-24 bg-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-pink-700 text-2xl font-bold">L</span>
                  </div>
                  <p className="text-sm text-pink-600">High-quality fabric texture</p>
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Leggings</h3>
              <Button variant="ghost" className="text-gray-600 hover:text-pink-600 p-0">
                Explore <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Category 2: Sports Bras */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-sage-100 to-sage-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-24 h-24 bg-sage-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-sage-700 text-2xl font-bold">B</span>
                  </div>
                  <p className="text-sm text-sage-600">Stylish support design</p>
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Bras</h3>
              <Button variant="ghost" className="text-gray-600 hover:text-pink-600 p-0">
                Explore <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Category 3: Sets */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-terracotta-100 to-terracotta-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-24 h-24 bg-terracotta-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-terracotta-700 text-2xl font-bold">S</span>
                  </div>
                  <p className="text-sm text-terracotta-600">Matching set lifestyle</p>
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Sets</h3>
              <Button variant="ghost" className="text-gray-600 hover:text-pink-600 p-0">
                Explore <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Layer 3: Best Sellers Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Best Sellers</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.isArray(products) ? products.slice(0, 4).map((product: any) => (
                <div key={product.id} className="group">
                  <div className="aspect-square bg-white rounded-lg mb-4 overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow">
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                      <span className="text-4xl font-bold text-pink-600">P</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-lg font-semibold text-gray-900 mb-4">₡{product.price}</p>
                  <Button size="sm" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    Quick Add
                  </Button>
                </div>
              )) : null}
            </div>
          )}
        </div>
      </section>

      {/* Layer 4: Technology Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Macro photography placeholder */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-600 text-3xl">🔬</span>
                </div>
                <p className="text-sm text-gray-600">Macro photography of fabric texture</p>
              </div>
            </div>

            {/* Right: Technology content */}
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Seamless Technology</h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Moisture-Wicking</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">4-Way Stretch</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Buttery Soft Feel</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Layer 5: Social Proof / Instagram Feed */}
      <section className="py-20 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Join the Movement</h2>
            <p className="text-xl text-gray-600">#MaluaActivewear</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg flex items-center justify-center">
                <Instagram className="h-8 w-8 text-pink-600" />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">Follow Us @MaluaActivewear</p>
            <div className="flex justify-center space-x-4">
              <Instagram className="h-6 w-6 text-gray-600 hover:text-pink-600 cursor-pointer" />
              <Facebook className="h-6 w-6 text-gray-600 hover:text-pink-600 cursor-pointer" />
              <Twitter className="h-6 w-6 text-gray-600 hover:text-pink-600 cursor-pointer" />
              <Youtube className="h-6 w-6 text-gray-600 hover:text-pink-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Logo & Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4">MALUA ACTIVEWEAR</h3>
              <p className="text-gray-400 mb-4">Engineered for Movement. Designed for Life.</p>
              <div className="flex space-x-4">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Column 2: Navigate */}
            <div>
              <h4 className="font-semibold mb-4">Navigate</h4>
              <ul className="space-y-2">
                <li><a href="/shop-all" className="text-gray-400 hover:text-white">Shop All</a></li>
                <li><a href="/new-arrivals" className="text-gray-400 hover:text-white">New Arrivals</a></li>
                <li><a href="/best-sellers" className="text-gray-400 hover:text-white">Best Sellers</a></li>
                <li><a href="/gift-cards" className="text-gray-400 hover:text-white">Gift Cards</a></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="/shipping" className="text-gray-400 hover:text-white">Shipping & Returns</a></li>
                <li><a href="/size-guide" className="text-gray-400 hover:text-white">Size Guide</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>

            {/* Column 4: About */}
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li><a href="/our-story" className="text-gray-400 hover:text-white">Our Story</a></li>
                <li><a href="/sustainability" className="text-gray-400 hover:text-white">Sustainability</a></li>
                <li><a href="/technology" className="text-gray-400 hover:text-white">Technology</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <span className="text-gray-400">© 2023 MALUA ACTIVEWEAR</span>
              <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-white">V</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-white">MC</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-white">AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
