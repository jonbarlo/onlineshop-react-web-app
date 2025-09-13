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
  Tag,
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatCurrency } from '@/config/app';
import { useTranslation } from 'react-i18next';

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Debug logging
  console.log('Dashboard - Current language:', i18n.language);
  console.log('Dashboard - Translation test:', t('admin.dashboard_title'));
  console.log('Dashboard - All admin keys:', Object.keys(i18n.getResourceBundle(i18n.language, 'translation')?.admin || {}));
  
  // Set page title
  useDocumentTitle('admin.dashboard');

  // Force re-render when language changes
  const [languageKey, setLanguageKey] = React.useState(i18n.language);

  React.useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageKey(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

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
      <Alert type="error" title={t('admin.failed_to_load_dashboard')}>
        {t('admin.unable_to_load_stats')}
      </Alert>
    );
  }

  const dashboardData = data?.data;

  if (!dashboardData) {
    return (
      <Alert type="error" title={t('admin.no_data_available')}>
        {t('admin.dashboard_stats_unavailable')}
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
      title: t('admin.total_orders'),
      value: statistics.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: t('admin.new_orders'),
      value: statistics.newOrders || 0,
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      title: t('admin.paid_orders'),
      value: statistics.paidOrders || 0,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      title: t('admin.delivered_orders'),
      value: alerts.readyForDelivery || 0,
      icon: Truck,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
  ];

  // Product Statistics Cards
  const productStatCards = [
    {
      title: t('admin.total_products'),
      value: statistics.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('admin.active_products'),
      value: statistics.activeProducts || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('admin.low_stock'),
      value: statistics.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: t('admin.total_customers'),
      value: statistics.totalCustomers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  // Performance Metrics
  const performanceCards = [
    {
      title: t('admin.conversion_rate'),
      value: `${performance.conversionRate || '0'}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('admin.average_order_value'),
      value: `$${performance.averageOrderValue || '0'}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('admin.stock_turnover'),
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
        <h1 key={languageKey} className="text-3xl font-bold text-secondary-900 dark:text-white">{t('admin.dashboard_title')}</h1>
        <p key={languageKey} className="text-secondary-600">{t('admin.dashboard_subtitle')}</p>
      </div>

      {/* Alerts Section */}
      {(alerts.lowStock > 0 || alerts.soldOut > 0 || alerts.newOrders > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.lowStock > 0 && (
            <Alert key={languageKey} type="warning" title={t('admin.low_stock_alert')}>
              {t('admin.low_stock_message', { count: alerts.lowStock })}
            </Alert>
          )}
          {alerts.soldOut > 0 && (
            <Alert key={languageKey} type="error" title={t('admin.sold_out_alert')}>
              {t('admin.sold_out_message', { count: alerts.soldOut })}
            </Alert>
          )}
          {alerts.newOrders > 0 && (
            <Alert key={languageKey} type="info" title={t('admin.new_orders_alert')}>
              {t('admin.new_orders_message', { count: alerts.newOrders })}
            </Alert>
          )}
        </div>
      )}

      {/* Order Statistics */}
      <div>
        <h2 key={languageKey} className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">{t('admin.order_statistics')}</h2>
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
            <CardTitle key={languageKey} className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              {t('admin.total_revenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-600">
              {formatCurrency(statistics.totalRevenue || 0)}
            </div>
            <p key={languageKey} className="text-sm text-secondary-600 mt-1">
              {t('admin.all_time_revenue')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle key={languageKey} className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              {t('admin.today_revenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600">
              {formatCurrency(statistics.todayRevenue || 0)}
            </div>
            <p key={languageKey} className="text-sm text-secondary-600 mt-1">
              {t('admin.revenue_today')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Statistics */}
      <div>
        <h2 key={languageKey} className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">{t('admin.product_inventory')}</h2>
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
        <h2 key={languageKey} className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">{t('admin.performance_metrics')}</h2>
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
            <CardTitle key={languageKey}>{t('admin.category_breakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryStats.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium text-secondary-900">{category.name}</span>
                  <span className="text-sm text-secondary-600">{category.productCount} {t('admin.products')}</span>
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
            <CardTitle key={languageKey}>{t('admin.recent_orders')}</CardTitle>
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
                          {formatCurrency(order.totalAmount || 0)}
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
                {t('admin.no_recent_orders')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle key={languageKey}>{t('admin.recent_products')}</CardTitle>
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
                            {product.price ? formatCurrency(product.price) : formatCurrency(0)}
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
                            {product.status === 'sold_out' ? t('admin.out_of_stock') : 
                             (product.quantity || 0) <= 5 ? t('admin.low_stock') : t('admin.in_stock')}
                          </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-secondary-600 text-center py-8">
                {t('admin.no_recent_products')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle key={languageKey}>{t('admin.quick_actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/orders">
              <div className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Eye className="h-8 w-8 text-primary-600" />
                  <div>
                    <h3 key={languageKey} className="font-medium text-secondary-900">{t('admin.view_all_orders')}</h3>
                    <p key={languageKey} className="text-sm text-secondary-500">{t('admin.manage_track_orders')}</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/products">
              <div className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Edit className="h-8 w-8 text-warning-600" />
                  <div>
                    <h3 key={languageKey} className="font-medium text-secondary-900">{t('admin.manage_products')}</h3>
                    <p key={languageKey} className="text-sm text-secondary-500">{t('admin.edit_product_catalog')}</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/categories">
              <div className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Tag className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 key={languageKey} className="font-medium text-secondary-900">{t('admin.manage_categories')}</h3>
                    <p key={languageKey} className="text-sm text-secondary-500">{t('admin.organize_categories')}</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/products/new">
              <div className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Plus className="h-8 w-8 text-success-600" />
                  <div>
                    <h3 key={languageKey} className="font-medium text-secondary-900">{t('admin.add_product')}</h3>
                    <p key={languageKey} className="text-sm text-secondary-500">{t('admin.create_new_product')}</p>
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