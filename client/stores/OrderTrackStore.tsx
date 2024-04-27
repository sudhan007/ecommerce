import { create } from "zustand";

type OrderTracking = {};

export const useOrderTrackStore = create<OrderTracking>((set) => ({
  orderTracking: {},
  setOrderTracking: (orderTracking: OrderTracking) => set({ orderTracking }),
}));
