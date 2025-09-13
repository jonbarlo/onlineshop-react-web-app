import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  ArrowLeft, 
  Edit, 
  CheckCircle, 
  Clock, 
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  Package
} from 'lucide-react';
import { apiService } from '@/services/api';
import { formatCurrency } from '@/config/app';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { OrderStatus } from '@/types';

const statusConfig = {
  new: {
    label: 'New Order',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    nextStatus: 'paid' as OrderStatus,
    nextLabel: 'Mark as Paid'
  },
  paid: {
    label: 'Paid',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    nextStatus: 'ready_for_delivery' as OrderStatus,
    nextLabel: 'Mark as Ready for Delivery'
  },
  ready_for_delivery: {
    label: 'Ready for Delivery',
    color: 'bg-green-100 text-green-800',
    icon: Truck,
    nextStatus: null,
    nextLabel: 'Completed'
  }
};

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, isLoading, error } = useQuery(
    ['order', id],
    () => apiService.getAdminOrder(Number(id)),
    {
      enabled: !!id,
    }
  );

  const updateStatusMutation = useMutation(
    (status: OrderStatus) => apiService.updateOrderStatus(Number(id), { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', id]);
        queryClient.invalidateQueries(['orders']);
        queryClient.invalidateQueries(['dashboard']);
        setIsUpdating(false);
      },
      onError: () => {
        setIsUpdating(false);
      }
    }
  );

  const order = data?.data;

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    updateStatusMutation.mutate(newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert type="error" title="Order not found">
          The order you're looking for doesn't exist or has been removed.
        </Alert>
        <div className="mt-6">
          <Link to="/admin/orders">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusConfig = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
              Order #{order.orderNumber}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.color}`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {currentStatusConfig.label}
            </span>
            <span className="text-sm text-secondary-500">
              Created {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to={`/admin/orders/${order.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
          </Link>
          {currentStatusConfig.nextStatus && (
            <Button
              onClick={() => handleStatusUpdate(currentStatusConfig.nextStatus!)}
              loading={isUpdating}
              disabled={isUpdating}
            >
              {currentStatusConfig.nextLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-500">Name</label>
                <p className="text-sm text-secondary-900">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-secondary-500">Email</label>
                <p className="text-sm text-secondary-900 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {order.customerEmail}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-secondary-500">Phone</label>
                <p className="text-sm text-secondary-900 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {order.customerPhone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-secondary-500">Delivery Address</label>
                <p className="text-sm text-secondary-900 flex items-start">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  {order.deliveryAddress}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-secondary-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-secondary-500">
                        Unit Price: {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-secondary-900">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
