import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  DollarSign, 
  Clock,
  CheckCircle,
  Truck,
  Eye,
  Edit,
  Plus,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    'dashboard',
    () => apiService.getDashboardStats(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Failed to load dashboard">
        Unable to load dashboard statistics. Please try again later.
      </Alert>
    );
  }

  const dashboardData = data?.data;

  if (!dashboardData) {
    return (
      <Alert type="error" title="No data available">
        Dashboard statistics are not available at the moment.
      </Alert>
    );
  }

  const { 
    statistics = {} as any, 
    performance = {} as any, 
    alerts = {} as any, 
    recentOrders = [], 
    recentProducts = [], 
    categoryStats = [] 
  } = dashboardData;


  // Order Statistics Cards
  const orderStatCards = [
    {
      title: 'Total Orders',
      value: statistics.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'New Orders',
      value: statistics.newOrders || 0,
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      title: 'Paid Orders',
      value: statistics.paidOrders || 0,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      title: 'Ready for Delivery',
      value: alerts.readyForDelivery || 0,
      icon: Truck,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
  ];

  // Product Statistics Cards
  const productStatCards = [
    {
      title: 'Total Products',
      value: statistics.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Products',
      value: statistics.activeProducts || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Low Stock',
      value: statistics.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Customers',
      value: statistics.totalCustomers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  // Performance Metrics
  const performanceCards = [
    {
      title: 'Conversion Rate',
      value: `${performance.conversionRate || '0'}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Order Value',
      value: `$${performance.averageOrderValue || '0'}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Stock Turnover',
      value: `${performance.stockTurnover || '0'}%`,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4" />
      
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Dashboard</h1>
        <p className="text-secondary-600">Comprehensive overview of your store performance</p>
      </div>

      {/* Alerts Section */}
      {(alerts.lowStock > 0 || alerts.soldOut > 0 || alerts.newOrders > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.lowStock > 0 && (
            <Alert type="warning" title="Low Stock Alert">
              {alerts.lowStock} products are running low on stock
            </Alert>
          )}
          {alerts.soldOut > 0 && (
            <Alert type="error" title="Sold Out Alert">
              {alerts.soldOut} products are completely sold out
            </Alert>
          )}
          {alerts.newOrders > 0 && (
            <Alert type="info" title="New Orders">
              {alerts.newOrders} new orders require attention
            </Alert>
          )}
        </div>
      )}

      {/* Order Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Order Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderStatCards && orderStatCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-secondary-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-600">
              ${(statistics.totalRevenue || 0).toFixed(2)}
            </div>
            <p className="text-sm text-secondary-600 mt-1">
              All-time revenue from orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600">
              ${(statistics.todayRevenue || 0).toFixed(2)}
            </div>
            <p className="text-sm text-secondary-600 mt-1">
              Revenue generated today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Product & Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productStatCards && productStatCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-secondary-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {performanceCards && performanceCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-secondary-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryStats && categoryStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryStats.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium text-secondary-900">{category.name}</span>
                  <span className="text-sm text-secondary-600">{category.productCount} products</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    to={`/admin/orders/${order.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {order.customerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-secondary-900">
                          ${(order.totalAmount || 0).toFixed(2)}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'new'
                              ? 'bg-warning-100 text-warning-800'
                              : order.status === 'paid'
                              ? 'bg-success-100 text-success-800'
                              : 'bg-secondary-100 text-secondary-800'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-secondary-600 text-center py-8">
                No recent orders
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProducts && recentProducts.length > 0 ? (
              <div className="space-y-4">
                {recentProducts
                  .slice(0, 5)
                  .map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {product.name || `Product ID ${product.id}`}
                          </p>
                          <p className="text-sm text-secondary-600">
                            ${product.price ? product.price.toFixed(2) : '0.00'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.status === 'sold_out'
                                ? 'bg-error-100 text-error-800'
                                : (product.quantity || 0) <= 5
                                ? 'bg-warning-100 text-warning-800'
                                : 'bg-success-100 text-success-800'
                            }`}
                          >
                            {product.status === 'sold_out' ? 'Sold Out' : 
                             (product.quantity || 0) <= 5 ? 'Low Stock' : 'In Stock'}
                          </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-secondary-600 text-center py-8">
                No recent products
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/orders">
              <div className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Eye className="h-8 w-8 text-primary-600" />
                  <div>
                    <h3 className="font-medium text-secondary-900">View All Orders</h3>
                    <p className="text-sm text-secondary-500">Manage and track orders</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/products">
              <div className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Edit className="h-8 w-8 text-warning-600" />
                  <div>
                    <h3 className="font-medium text-secondary-900">Manage Products</h3>
                    <p className="text-sm text-secondary-500">Edit product catalog</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/products/new">
              <div className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Plus className="h-8 w-8 text-success-600" />
                  <div>
                    <h3 className="font-medium text-secondary-900">Add Product</h3>
                    <p className="text-sm text-secondary-500">Create new product</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};