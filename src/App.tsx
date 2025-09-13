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

function App() {
  console.log('App component rendered');
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="category/:category" element={<CategoryPage />} />
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
