import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProductList } from '@/pages/ProductList';
import { ProductDetail } from '@/pages/ProductDetail';
import { CategoryPage } from '@/pages/CategoryPage';
import { Cart } from '@/pages/Cart';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminOrders } from '@/pages/AdminOrders';
import { AdminProducts } from '@/pages/AdminProducts';
import { AdminCategories } from '@/pages/AdminCategories';
import { OrderDetail } from '@/pages/OrderDetail';
import { OrderEdit } from '@/pages/OrderEdit';
import { ProductCreate } from '@/pages/ProductCreate';
import { ProductEdit } from '@/pages/ProductEdit';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Check if MALUA ACTIVEWEAR theme is active
const isMaluaActivewearTheme = import.meta.env.VITE_THEME_NAME === 'MaluaActiveWear';

// Lazy load MALUA components only when theme is active
const MaluaActivewearHomepage = isMaluaActivewearTheme 
  ? React.lazy(() => import('./pages/MaluaActivewearHomepage').then(module => ({ default: module.MaluaActivewearHomepage })))
  : React.lazy(() => Promise.resolve({ default: () => <div>Theme not available</div> }));

const MaluaActivewearCategory = isMaluaActivewearTheme 
  ? React.lazy(() => import('./pages/MaluaActivewearCategory').then(module => ({ default: module.MaluaActivewearCategory })))
  : React.lazy(() => Promise.resolve({ default: () => <div>Theme not available</div> }));

const MaluaActivewearProductDetail = isMaluaActivewearTheme 
  ? React.lazy(() => import('./pages/MaluaActivewearProductDetail').then(module => ({ default: module.MaluaActivewearProductDetail })))
  : React.lazy(() => Promise.resolve({ default: () => <div>Theme not available</div> }));

function App() {
  console.log('App component rendered');
  console.log('Theme:', import.meta.env.VITE_THEME_NAME);
  console.log('Is MALUA theme:', isMaluaActivewearTheme);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route 
          index 
          element={
            isMaluaActivewearTheme ? (
              <Suspense fallback={<LoadingSpinner />}>
                <MaluaActivewearHomepage />
              </Suspense>
            ) : (
              <ProductList />
            )
          } 
        />
        
        
        {/* Default routes */}
        <Route 
          path="products/:id" 
          element={
            isMaluaActivewearTheme ? (
              <Suspense fallback={<LoadingSpinner />}>
                <MaluaActivewearProductDetail />
              </Suspense>
            ) : (
              <ProductDetail />
            )
          } 
        />
        <Route 
          path="category/:category" 
          element={
            isMaluaActivewearTheme ? (
              <Suspense fallback={<LoadingSpinner />}>
                <MaluaActivewearCategory />
              </Suspense>
            ) : (
              <CategoryPage />
            )
          } 
        />
        <Route path="cart" element={<Cart />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="orders/:id/edit" element={<OrderEdit />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductCreate />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;