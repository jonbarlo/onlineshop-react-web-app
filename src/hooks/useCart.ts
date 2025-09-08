import { useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, Product } from '@/types';

const CART_STORAGE_KEY = 'simpleShop_cart';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = useCallback((items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return { totalItems, totalAmount };
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.id === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = prevCart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...prevCart.items, { product, quantity }];
      }

      const { totalItems, totalAmount } = calculateTotals(newItems);
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    });
  }, [calculateTotals]);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      const { totalItems, totalAmount } = calculateTotals(newItems);
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    });
  }, [calculateTotals]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      const { totalItems, totalAmount } = calculateTotals(newItems);
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    });
  }, [removeFromCart, calculateTotals]);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      totalItems: 0,
      totalAmount: 0,
    });
  }, []);

  const getItemQuantity = useCallback((productId: number) => {
    const item = cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [cart.items]);

  // Force re-render when cart changes
  const [, forceUpdate] = useState({});
  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    triggerUpdate,
  };
};
