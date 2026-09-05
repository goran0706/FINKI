import { create } from "zustand";

const useCountStore = create((set) => ({
  count: 0,
  dec: () => set((state) => ({ count: state.count - 1 })),
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

export default useCountStore;
