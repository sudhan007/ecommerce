import { create } from "zustand";

type Address = {};

export const useAddressStore = create((set) => ({
  address: {},
  setAddress: (address: Address) => set({ address }),
}));
