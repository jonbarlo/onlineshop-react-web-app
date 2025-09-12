import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X } from 'lucide-react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { OrderStatus } from '@/types';

interface OrderEditForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
}

export const OrderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery(
    ['order', id],
    () => apiService.getAdminOrder(Number(id)),
    {
      enabled: !!id,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderEditForm>();

  // Reset form when order data loads
  React.useEffect(() => {
    if (data?.data) {
      const order = data.data;
      reset({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        status: order.status,
      });
    }
  }, [data, reset]);

  const updateOrderMutation = useMutation(
    (formData: OrderEditForm) => {
      // For now, we'll only update the status since that's what the API supports
      return apiService.updateOrderStatus(Number(id), { status: formData.status });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', id]);
        queryClient.invalidateQueries(['orders']);
        queryClient.invalidateQueries(['dashboard']);
        navigate(`/admin/orders/${id}`);
      },
      onError: (error: any) => {
        setSubmitError(error.response?.data?.message || 'Failed to update order');
        setIsSubmitting(false);
      }
    }
  );

  const onSubmit = async (formData: OrderEditForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    updateOrderMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data?.data) {
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

  const order = data.data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link to={`/admin/orders/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Order
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
              Edit Order #{order.orderNumber}
            </h1>
          </div>
          <p className="text-secondary-600">
            Update order information and status
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Customer Name"
                {...register('customerName', { required: 'Name is required' })}
                error={errors.customerName?.message}
                required
              />
              <FormInput
                label="Email"
                type="email"
                {...register('customerEmail', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.customerEmail?.message}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Phone Number"
                {...register('customerPhone', { required: 'Phone is required' })}
                error={errors.customerPhone?.message}
                required
              />
            </div>
            <FormInput
              label="Delivery Address"
              {...register('deliveryAddress', { required: 'Address is required' })}
              error={errors.deliveryAddress?.message}
              required
            />
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Status
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="new">New Order</option>
                <option value="paid">Paid</option>
                <option value="ready_for_delivery">Ready for Delivery</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items (Read-only) */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
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
                      Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-secondary-900">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {submitError && (
          <Alert type="error" title="Update Failed">
            {submitError}
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link to={`/admin/orders/${id}`}>
            <Button type="button" variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
