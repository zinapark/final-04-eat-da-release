import { create } from 'zustand';

interface CartStore {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  decrementCart: () => void;
}

const useCartStore = create<CartStore>((set) => ({
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  decrementCart: () =>
    set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),
}));

export default useCartStore;
