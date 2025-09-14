import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckCircle } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { formatCurrency } from '@/config/app';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Alert } from '@/components/ui/Alert';
import { OrderForm as OrderFormType } from '@/types';
import { useTranslation } from 'react-i18next';

interface OrderFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onClose, onSuccess }) => {
  const { cart } = useCartContext();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormType>();

  const onSubmit = async (data: OrderFormType) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Frontend validation: Check if any items are sold out or have insufficient inventory
    const unavailableItems = cart.items.filter(item => 
      item.product.status === 'sold_out' || item.quantity > item.product.quantity
    );

    if (unavailableItems.length > 0) {
      const itemNames = unavailableItems.map(item => item.product.name).join(', ');
      setSubmitError(t('checkout.items_unavailable', { items: itemNames }));
      setIsSubmitting(false);
      return;
    }

    try {
      const orderData = {
        ...data,
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedColor: item.variant?.color,
          selectedSize: item.variant?.size,
        })),
      };

      const response = await apiService.createOrder(orderData);

      if (response.success) {
        setOrderSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setSubmitError(response.message || 'Failed to create order');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to create order';
      setSubmitError(errorMessage || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              {t('checkout.order_placed_successfully')}
            </h2>
            <p className="text-secondary-600">
              {t('checkout.thank_you_order')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('checkout.title')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <Alert type="error" title="Error">
                {submitError}
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label={t('checkout.full_name')}
                placeholder="John Doe"
                {...register('customerName', { required: t('checkout.name_required') })}
                error={errors.customerName?.message}
                required
              />
              <FormInput
                label={t('checkout.email')}
                type="email"
                placeholder="john@example.com"
                {...register('customerEmail', {
                  required: t('checkout.email_required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('checkout.invalid_email'),
                  },
                })}
                error={errors.customerEmail?.message}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label={t('checkout.phone_number')}
                placeholder="+1234567890"
                {...register('customerPhone', { required: t('checkout.phone_required') })}
                error={errors.customerPhone?.message}
                required
              />
            </div>

            <FormInput
              label={t('checkout.delivery_address')}
              placeholder="123 Main St, City, Country"
              {...register('deliveryAddress', { required: t('checkout.address_required') })}
              error={errors.deliveryAddress?.message}
              required
            />

            {/* Order Summary */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-secondary-900 mb-2">{t('checkout.order_summary')}</h3>
              <div className="space-y-2 text-sm">
                {cart.items.map((item) => (
                  <div key={`${item.product.id}-${item.variant?.id || 'no-variant'}`} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex flex-col">
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        {item.variant && (
                          <span className="text-xs text-secondary-600">
                            {item.variant.color} - {item.variant.size}
                          </span>
                        )}
                      </div>
                      {item.product.status === 'sold_out' && (
                        <span className="ml-2 text-xs text-red-600 font-medium">{t('checkout.sold_out')}</span>
                      )}
                      {item.product.status === 'available' && item.quantity > item.product.quantity && (
                        <span className="ml-2 text-xs text-orange-600 font-medium">{t('checkout.insufficient_stock')}</span>
                      )}
                    </div>
                    <span>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>{t('cart.total')}</span>
                  <span>{formatCurrency(cart.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t('checkout.cancel')}
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                className="flex-1"
              >
                {t('checkout.place_order')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
