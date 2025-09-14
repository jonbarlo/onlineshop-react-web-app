import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CartItem } from './CartItem';
import { OrderForm } from './OrderForm';
import { useTranslation } from 'react-i18next';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartContext();
  const { t } = useTranslation();
  const [showOrderForm, setShowOrderForm] = useState(false);

  console.log('Cart component rendered with cart:', cart);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')} {t('navigation.home')}
          </Button>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              {t('cart.empty_cart')}
            </h2>
            <p className="text-secondary-600 mb-6">
              Add some products to get started
            </p>
            <Button onClick={() => navigate('/')}>
              {t('cart.continue_shopping')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')} {t('navigation.home')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('cart.title')} ({cart.totalItems} {t('cart.items_count_plural')})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {cart.items.map((item) => (
                <CartItem
                  key={`${item.product.id}-${item.variant?.id || 'no-variant'}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{t('cart.items_count_plural')} ({cart.totalItems})</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('cart.shipping')}</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('cart.total')}</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={() => setShowOrderForm(true)}
                className="w-full"
                size="lg"
              >
                {t('cart.proceed_to_checkout')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          onClose={() => setShowOrderForm(false)}
          onSuccess={() => {
            clearCart();
            setShowOrderForm(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
};
