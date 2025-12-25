import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, MenuItem, SelectedAddon } from '@/lib/types';

interface CartStore {
    items: CartItem[];
    addItem: (item: MenuItem, quantity?: number, selected_addons?: SelectedAddon[], specialInstructions?: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (menuItem, quantity = 1, selected_addons = [], specialInstructions = '') => {
                const { items } = get();

                // For items with different addons, we treat them as separate cart items
                const existingItemIndex = items.findIndex((i) =>
                    i.menu_item_id === menuItem.id &&
                    JSON.stringify(i.selected_addons || []) === JSON.stringify(selected_addons)
                );

                if (existingItemIndex > -1) {
                    const newItems = [...items];
                    newItems[existingItemIndex] = {
                        ...newItems[existingItemIndex],
                        quantity: newItems[existingItemIndex].quantity + quantity,
                        updated_at: new Date().toISOString(),
                    };
                    set({ items: newItems });
                } else {
                    const newItem: CartItem = {
                        id: Math.random().toString(36).substring(7),
                        user_id: '',
                        restaurant_id: menuItem.restaurant_id,
                        menu_item_id: menuItem.id,
                        quantity,
                        special_instructions: specialInstructions,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        menu_item: menuItem,
                        selected_addons,
                    };
                    set({ items: [...items, newItem] });
                }
            },
            removeItem: (itemId) => {
                set({ items: get().items.filter((i) => i.id !== itemId) });
            },
            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === itemId ? { ...i, quantity, updated_at: new Date().toISOString() } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => {
                    const itemPrice = item.menu_item?.price || 0;
                    const addonsPrice = (item.selected_addons || []).reduce((sum, addon) => sum + (addon.price || 0), 0);
                    return total + (itemPrice + addonsPrice) * item.quantity;
                }, 0);
            },
            getItemCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : dummyStorage)),
        }
    )
);

const dummyStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
};
