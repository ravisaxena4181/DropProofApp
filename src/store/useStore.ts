import {create} from 'zustand';

type Delivery = {
  id: string;
  address: string;
  status: 'pending' | 'out_for_delivery' | 'completed';
  lat?: number;
  lng?: number;
};

type State = {
  deliveries: Delivery[];
  loadMockDeliveries: () => void;
  getDeliveryById: (id: string) => Delivery | null;
  completeDelivery: (id: string) => void;
};

const useStore = create<State>((set, get) => ({
  deliveries: [],
  loadMockDeliveries: () =>
    set({
      deliveries: [
        { id: '1', address: '123 Main St', status: 'pending', lat: 37.7749, lng: -122.4194 },
        { id: '2', address: '456 Pine Ave', status: 'out_for_delivery', lat: 37.7849, lng: -122.4094 },
      ],
    }),
  getDeliveryById: (id: string) => get().deliveries.find((d) => d.id === id) ?? null,
  completeDelivery: (id: string) =>
    set((state) => ({ deliveries: state.deliveries.map((d) => (d.id === id ? { ...d, status: 'completed' } : d)) })),
}));

export type { Delivery };
export default useStore;
