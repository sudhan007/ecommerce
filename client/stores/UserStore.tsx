import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
interface UserStore {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User;
  setUser: (value: User) => void;
  token?: string;
  setToken?: (value: string) => void;
}

type User = {
  _id: string;
  phone: string;
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        setIsLoggedIn: (value) => set({ isLoggedIn: value }),
        setUser: (value) => set({ user: value }),
        setToken: (value) => set({ token: value }),
        token: "",
        user: {
          _id: "",
          phone: "",
        },
      }),
      {
        name: "userStore",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
