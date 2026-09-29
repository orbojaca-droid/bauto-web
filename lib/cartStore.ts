/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - AGENTE 1: Estado del Carrito & Sincronización Multi-Pestaña
 * @Propósito: Store reactivo con Zustand, persistencia en localStorage (solo datos, no UI)
 *             y sincronización atómica en tiempo real entre pestañas mediante BroadcastChannel.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Talla } from "../types/catalog";

// Umbral oficial para entrega de cortesía nacional: $300.000 COP
export const FREE_SHIPPING_THRESHOLD_COP = 300000;

export interface CartStoreState {
  items: CartItem[];
  isOpen: boolean; // Estado del Drawer lateral / Bottom Sheet
  isGiftPackaging: boolean;
  giftDedicationNote: string;
  isHydrated: boolean;

  // Acciones transaccionales
  addItem: (product: Product, size: Talla, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  toggleGiftPackaging: (enabled: boolean, note?: string) => void;
  setGiftDedicationNote: (note: string) => void;
  setHydrated: () => void;

  // Selectores computados
  getSubtotal: () => number;
  getTotalItems: () => number;
  }

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel("bauto_cart_channel");
  } catch (e) {
    console.warn("BroadcastChannel no disponible en este entorno:", e);
  }
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isGiftPackaging: false,
      giftDedicationNote: "",
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      setDrawerOpen: (isOpen: boolean) => set({ isOpen }),

      addItem: (product: Product, size: Talla, quantity = 1) => {
        const itemId = `${product.id}-${size}`;
        const currentItems = get().items;
        const existingIdx = currentItems.findIndex((i) => i.id === itemId);

        let updatedItems: CartItem[];

        if (existingIdx >= 0) {
          updatedItems = currentItems.map((item, idx) => {
            if (idx === existingIdx) {
              const newQty = item.quantity + quantity;
              return {
                ...item,
                quantity: newQty,
                totalPrice: newQty * item.unitPrice,
              };
            }
            return item;
          });
        } else {
          const newItem: CartItem = {
            id: itemId,
            product,
            selectedSize: size,
            quantity,
            unitPrice: product.price,
            totalPrice: product.price * quantity,
          };
          updatedItems = [...currentItems, newItem];
        }

        set({ items: updatedItems, isOpen: true });

        broadcastChannel?.postMessage({
          type: "CART_UPDATED",
          items: updatedItems,
        });
      },

      removeItem: (itemId: string) => {
        const updatedItems = get().items.filter((item) => item.id !== itemId);
        set({ items: updatedItems });

        broadcastChannel?.postMessage({
          type: "CART_UPDATED",
          items: updatedItems,
        });
      },

      updateQuantity: (itemId: string, delta: number) => {
        const currentItems = get().items;
        const updatedItems = currentItems
          .map((item) => {
            if (item.id === itemId) {
              const newQty = item.quantity + delta;
              if (newQty <= 0) return null;
              return {
                ...item,
                quantity: newQty,
                totalPrice: newQty * item.unitPrice,
              };
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        set({ items: updatedItems });

        broadcastChannel?.postMessage({
          type: "CART_UPDATED",
          items: updatedItems,
        });
      },

      clearCart: () => {
        set({ items: [], isOpen: false });
        broadcastChannel?.postMessage({
          type: "CART_UPDATED",
          items: [],
        });
      },

      toggleGiftPackaging: (enabled: boolean, note = "") => {
        set({ isGiftPackaging: enabled, giftDedicationNote: note });
      },

      setGiftDedicationNote: (note: string) => {
        set({ giftDedicationNote: note });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "bauto_cart_storage",
      // AUDITORÍA: Persistir únicamente datos de la bolsa, nunca estados de UI efímeros como isOpen o isHydrated
      partialize: (state) => ({
        items: state.items,
        isGiftPackaging: state.isGiftPackaging,
        giftDedicationNote: state.giftDedicationNote,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    if (event.data?.type === "CART_UPDATED" && Array.isArray(event.data.items)) {
      useCartStore.setState({ items: event.data.items });
    }
  };
}
