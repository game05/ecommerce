'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  customization?: any;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.id === item.id && JSON.stringify(i.customization) === JSON.stringify(item.customization)
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && JSON.stringify(i.customization) === JSON.stringify(item.customization)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: quantity === 0
            ? state.items.filter((i) => i.id !== itemId)
            : state.items.map((i) =>
                i.id === itemId ? { ...i, quantity } : i
              ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'cart-storage',
    }
  )
);
