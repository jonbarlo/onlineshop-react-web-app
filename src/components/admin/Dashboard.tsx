import React from 'react';
import { useQuery } from 'react-query';
import { 
  ShoppingCart, 
  DollarSign, 
  Clock,
  CheckCircle,
  Truck
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

  if (!stats) {
    return (
      <Alert type="error" title="No data available">
        Dashboard statistics are not available at the moment.
      </Alert>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'New Orders',
      value: stats.newOrders,
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      title: 'Paid Orders',
      value: stats.paidOrders,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      title: 'Ready for Delivery',
      value: stats.readyForDeliveryOrders,
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
            ${stats.totalRevenue.toFixed(2)}
          </div>
          <p className="text-sm text-secondary-600 mt-1">
            All-time revenue from orders
          </p>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
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
