import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem, Product, Order } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("sv-cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("sv-orders");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("sv-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("sv-orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        toast.success(`Updated quantity for ${product.title.slice(0, 30)}...`);
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      toast.success(`Added to cart!`);
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
    toast.info("Removed from cart");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const placeOrder = useCallback(() => {
    if (items.length === 0) return;
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...items],
      total: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      date: new Date().toISOString(),
      status: "processing",
    };
    setOrders(prev => [order, ...prev]);
    setItems([]);
    toast.success(`Order ${order.id} placed successfully!`);
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, orders, addToCart, removeFromCart, updateQuantity, clearCart, placeOrder, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
