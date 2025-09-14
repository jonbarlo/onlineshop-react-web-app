import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart, CartItem, Product, ProductVariant } from '@/types';

const CART_STORAGE_KEY = 'simpleShop_cart';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant | null) => void;
  removeFromCart: (productId: number, variantId: number | null) => void;
  updateQuantity: (productId: number, variantId: number | null, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number, variantId?: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    console.log('CartProvider: Loading cart from localStorage:', savedCart);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('CartProvider: Parsed cart from localStorage:', parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('CartProvider: Error parsing cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('CartProvider: Saving cart to localStorage:', cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = useCallback((items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return { totalItems, totalAmount };
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1, variant?: ProductVariant | null) => {
    console.log('CartProvider: addToCart called with:', { product: product.name, quantity, variant });
    
    // Check if product is available
    if (product.status === 'sold_out') {
      console.warn('CartProvider: Cannot add sold out product to cart:', product.name);
      return;
    }
    
    // Check inventory - use variant quantity if available, otherwise product quantity
    const availableQuantity = variant ? variant.quantity : product.quantity;
    if (availableQuantity < quantity) {
      console.warn('CartProvider: Not enough inventory for product:', product.name, 'requested:', quantity, 'available:', availableQuantity);
      return;
    }
    
    setCart(prevCart => {
      console.log('CartProvider: Current cart before adding:', prevCart);
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.id === product.id && 
        ((!item.variant && !variant) || (item.variant?.id === variant?.id))
      );

      let newItems: CartItem[];
      let newQuantity = quantity;

      if (existingItemIndex >= 0) {
        // Check if adding this quantity would exceed available inventory
        const currentQuantity = prevCart.items[existingItemIndex].quantity;
        const totalQuantity = currentQuantity + quantity;
        
        if (totalQuantity > availableQuantity) {
          console.warn('CartProvider: Adding quantity would exceed inventory:', product.name, 'current:', currentQuantity, 'adding:', quantity, 'available:', availableQuantity);
          newQuantity = availableQuantity - currentQuantity;
          if (newQuantity <= 0) {
            console.warn('CartProvider: Cannot add more of this product, inventory exceeded');
            return prevCart;
          }
        }
        
        // Update existing item
        newItems = prevCart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newQuantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...prevCart.items, { product, quantity: newQuantity, variant }];
      }

      const { totalItems, totalAmount } = calculateTotals(newItems);
      const newCart = {
        items: newItems,
        totalItems,
        totalAmount,
      };
      console.log('CartProvider: New cart after adding:', newCart);
      return newCart;
    });
  }, [calculateTotals]);

  const removeFromCart = useCallback((productId: number, variantId: number | null) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => 
        !(item.product.id === productId && 
          ((!item.variant && variantId === null) || (item.variant?.id === variantId)))
      );
      const { totalItems, totalAmount } = calculateTotals(newItems);
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    });
  }, [calculateTotals]);

  const updateQuantity = useCallback((productId: number, variantId: number | null, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart(prevCart => {
      const item = prevCart.items.find(item => 
        item.product.id === productId && 
        ((!item.variant && variantId === null) || (item.variant?.id === variantId))
      );
      if (!item) return prevCart;
      
      // Check if the new quantity exceeds available inventory
      const availableQuantity = item.variant ? item.variant.quantity : item.product.quantity;
      if (quantity > availableQuantity) {
        console.warn('CartProvider: Cannot update quantity, exceeds inventory:', item.product.name, 'requested:', quantity, 'available:', availableQuantity);
        return prevCart;
      }

      const newItems = prevCart.items.map(item =>
        (item.product.id === productId && 
         ((!item.variant && variantId === null) || (item.variant?.id === variantId)))
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

  const getItemQuantity = useCallback((productId: number, variantId?: number) => {
    const item = cart.items.find(item => 
      item.product.id === productId && 
      ((!item.variant && !variantId) || (item.variant?.id === variantId))
    );
    return item ? item.quantity : 0;
  }, [cart.items]);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
