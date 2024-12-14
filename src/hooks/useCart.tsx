'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  customization: any | null;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addToCart: (newItem) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && 
                     JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
          );

          if (existingItemIndex > -1) {
            // Si l'item existe déjà, on met à jour sa quantité
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          } else {
            // Sinon, on ajoute le nouvel item
            return { items: [...state.items, newItem] };
          }
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== itemId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'shopping-cart',
      storage: createJSONStorage(() => localStorage),
      skipHydration: false,
      version: 1,
    }
  )
);
