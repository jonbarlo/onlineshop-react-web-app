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
  Plus
} from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';

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

  const stats = data?.data;

  console.log('Dashboard data:', data);
  console.log('Dashboard stats:', stats);

  if (!stats) {
    return (
      <Alert type="error" title="No data available">
        Dashboard statistics are not available at the moment.
      </Alert>
    );
  }

  // Extract the actual statistics from the nested structure
  const statistics = stats.statistics || {};
  const recentOrders = stats.recentOrders || [];
  
  console.log('Statistics object:', statistics);
  console.log('Recent orders:', recentOrders);

  const statCards = [
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
      value: statistics.readyForDeliveryOrders || 0,
      icon: Truck,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
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

      {/* Revenue Card */}
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
            <Link to="/admin/orders/new">
              <div className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Plus className="h-8 w-8 text-success-600" />
                  <div>
                    <h3 className="font-medium text-secondary-900">Create Order</h3>
                    <p className="text-sm text-secondary-500">Add a new order manually</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
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
                      ${order.totalAmount.toFixed(2)}
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
    </div>
  );
};
