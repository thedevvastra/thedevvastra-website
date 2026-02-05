import { create } from "zustand";

interface ShopStore {
  cartCount: number;
  wishlistCount: number;
  setCounts: (cart: number, wishlist: number) => void;
  incrementCart: () => void;
  incrementWishlist: () => void;
  decrementWishlist: () => void;
}

export const useShopStore = create<ShopStore>((set) => ({
  cartCount: 0,
  wishlistCount: 0,
  setCounts: (cart, wishlist) =>
    set({ cartCount: cart, wishlistCount: wishlist }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  incrementWishlist: () =>
    set((state) => ({ wishlistCount: state.wishlistCount + 1 })),
  decrementWishlist: () =>
    set((state) => ({ wishlistCount: Math.max(0, state.wishlistCount - 1) })),
}));
