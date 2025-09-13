import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom'; // Unused since hiding categories section
import { 
  // Smartphone, 
  // Shirt, 
  // Home, 
  // Gamepad2, 
  ArrowRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Grid,
  List,
  Search,
  Heart,
  // Package
} from 'lucide-react';
import { apiService } from '@/services/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useBrandTheme } from '@/contexts/ThemeContext';

// Import the Category type from types - COMMENTED OUT SINCE HIDING CATEGORIES SECTION
// import { Category as DbCategory } from '@/types';

// Icon mapping for categories - COMMENTED OUT SINCE HIDING CATEGORIES SECTION
// const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
//   'electronics': Smartphone,
//   'clothing': Shirt,
//   'home': Home,
//   'sports': Gamepad2,
//   'default': Package, // fallback icon
// };

// Color mapping for categories - COMMENTED OUT SINCE HIDING CATEGORIES SECTION
// const categoryColors: Record<string, string> = {
//   'electronics': 'from-blue-500 to-purple-600',
//   'clothing': 'from-pink-500 to-rose-600', 
//   'home': 'from-green-500 to-emerald-600',
//   'sports': 'from-orange-500 to-red-600',
//   'default': 'from-gray-500 to-gray-600',
// };

export const ProductList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const { theme } = useBrandTheme();
  const { t, i18n, ready } = useTranslation();

  // Debug logging for translations
  console.log('ProductList - Current language:', i18n.language);
  console.log('ProductList - i18n ready:', ready);
  console.log('ProductList - Featured translation:', t('products.featured'));
  console.log('ProductList - Bestseller translation:', t('products.bestseller'));

  // Force re-render when language changes
  const [languageKey, setLanguageKey] = useState(i18n.language);
  
  React.useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('Language changed to:', lng);
      setLanguageKey(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  // Fetch categories from database - COMMENTED OUT SINCE HIDING CATEGORIES SECTION
  // const { data: categoriesData } = useQuery(
  //   ['categories'],
  //   () => apiService.getCategories(),
  //   {
  //     keepPreviousData: true,
  //     staleTime: 15 * 60 * 1000, // 15 minutes
  //   }
  // );

  // Fetch products
  const { data, isLoading, error } = useQuery(
    ['products'],
    () => {
      return apiService.getProducts({
        page: 1,
        limit: 50, // Get more products for client-side filtering
      });
    },
    {
      keepPreviousData: true,
      staleTime: 15 * 60 * 1000, // 15 minutes - products don't change often
      cacheTime: 60 * 60 * 1000, // 1 hour - keep in cache longer
    }
  );

  // Handle the actual API response structure
  const allProducts = Array.isArray(data?.data) ? data.data : [];
  
  // Transform database categories to display format - COMMENTED OUT SINCE HIDING CATEGORIES SECTION
  // const categories = (categoriesData?.data || [])
  //   .filter((cat: DbCategory) => cat.isActive === true) // Only show active categories
  //   .map((cat: DbCategory) => ({
  //     id: cat._id || cat.slug,
  //     name: cat.name,
  //     icon: categoryIcons[cat.slug] || categoryIcons.default,
  //     href: `/category/${cat.slug}`,
  //     description: cat.description || `Explore ${cat.name}`,
  //     color: categoryColors[cat.slug] || categoryColors.default,
  //   }));
  
  // Client-side filtering
  const products = search 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        (typeof product.category === 'object' && product.category !== null 
          ? (product.category as { name: string }).name.toLowerCase().includes(search.toLowerCase())
          : product.category.toLowerCase().includes(search.toLowerCase()))
      )
    : allProducts.slice(0, 12); // Show first 12 products when no search

  // Conditional layout based on theme
  const isActivewearTheme = theme?.name === 'MaluaActiveWear';

  return (
    <div className="space-y-12">
      {/* Conditional Hero Section */}
      {isActivewearTheme ? (
        // Activewear Hero Section
        <section className="relative overflow-hidden rounded-3xl">
          {/* Background with lifestyle image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(248, 187, 217, 0.2) 0%, rgba(233, 30, 99, 0.1) 100%), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
            }}
          />
          
          {/* Content */}
          <div className="relative p-8 md:p-16 lg:p-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 key={languageKey} className="text-5xl md:text-7xl font-bold mb-6">
                <span className="block text-white drop-shadow-lg">{t('homepage.hero_title_part1')}</span>
                <span 
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.primaryDark})`
                  }}
                >
                  {t('homepage.hero_title_part2')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                {theme?.branding.siteDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.primaryDark})`,
                    border: 'none'
                  }}
                >
                  {t('homepage.shop_collection')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold border-2 bg-white/10 backdrop-blur-sm"
                  style={{
                    borderColor: 'white',
                    color: 'white'
                  }}
                >
                  {t('homepage.view_lookbook')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              {/* Feature badges */}
              <div key={languageKey} className="flex flex-wrap justify-center gap-6 text-sm text-white">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>{t('homepage.free_shipping_badge')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>{t('homepage.day_returns_badge')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>{t('homepage.sustainable_materials_badge')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Original 506software Hero Section
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme?.colors.primary}, ${theme?.colors.primaryDark})`
                }}
              >
                {theme?.branding.siteName}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Conditional Features Section */}
      {isActivewearTheme ? (
        // Activewear Features Section
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: theme?.colors.primary }}>
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h3 key={`${languageKey}-fs`} className="text-lg font-semibold text-gray-900 mb-2">{t('benefits.free_shipping_title')}</h3>
            <p className="text-gray-600 text-sm">{t('benefits.free_shipping_desc')}</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: theme?.colors.primary }}>
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 key={`${languageKey}-s`} className="text-lg font-semibold text-gray-900 mb-2">{t('benefits.sustainable_title')}</h3>
            <p className="text-gray-600 text-sm">{t('benefits.sustainable_desc')}</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: theme?.colors.primary }}>
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <h3 key={`${languageKey}-er`} className="text-lg font-semibold text-gray-900 mb-2">{t('benefits.easy_returns_title')}</h3>
            <p className="text-gray-600 text-sm">{t('benefits.easy_returns_desc')}</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: theme?.colors.primary }}>
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 key={`${languageKey}-c`} className="text-lg font-semibold text-gray-900 mb-2">{t('benefits.community_title')}</h3>
            <p className="text-gray-600 text-sm">{t('benefits.community_desc')}</p>
          </div>
        </section>
      ) : (
        // Original 506software Features Section
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-soft">
            <Truck className="h-8 w-8 text-brand-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Free shipping on orders over $50</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-soft">
            <Shield className="h-8 w-8 text-brand-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Shopping</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your data is protected</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-soft">
            <RefreshCw className="h-8 w-8 text-brand-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">30-day return policy</p>
          </div>
        </section>
      )}

      {/* Categories - HIDDEN FOR NOW */}
      {/* 
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          <Button variant="ghost" className="nav-link">
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.href}
                className="category-card group"
              >
                <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      */}

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
                 <h2 key={languageKey} className="text-3xl font-bold text-gray-900 dark:text-white">{t('products.featured')}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <span key={languageKey} className="ml-2 text-sm text-gray-600 dark:text-gray-400">{t('products.bestseller')}</span>
            </div>
            
            {/* View Toggle Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-center">
              <div className="max-w-md w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('search.placeholder')}
                    value={search}
                    onChange={setSearch}
                    className="pl-10"
                  />
                </div>
                {search && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Found {products.length} product{products.length !== 1 ? 's' : ''} matching "{search}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ProductGrid
          products={products}
          loading={isLoading}
          error={error instanceof Error ? error.message : null}
          viewMode={viewMode}
        />
      </section>
    </div>
  );
};
