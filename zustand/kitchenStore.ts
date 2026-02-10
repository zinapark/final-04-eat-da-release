import { create } from 'zustand';

interface KitchenState {
  nearestKitchen: string;
  setNearestKitchen: (name: string) => void;
}

const useKitchenStore = create<KitchenState>()((set) => ({
  nearestKitchen: '서교동 공유주방',
  setNearestKitchen: (name) => set({ nearestKitchen: name }),
}));

export default useKitchenStore;
