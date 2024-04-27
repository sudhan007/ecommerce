import { create } from "zustand";

type Product = {
  _id: string;
  quantity: number;
  price: number;
  name?: string;
};

type CartStore = {
  iscartOpen: boolean;
  setIsCartOpen: (value: boolean) => void;
  cartCount: number;
  setCartCount: (value: number) => void;
  products: Product[];
  totalPrice?: number;
};

export const useCartStore = create<CartStore>((set) => ({
  iscartOpen: false,
  setIsCartOpen: (value) => set({ iscartOpen: value }),
  cartCount: 0,
  setCartCount: (value) => set({ cartCount: value }),
  products: [],
  name: "",
  totalPrice: 0,
}));
