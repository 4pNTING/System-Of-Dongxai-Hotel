// src/@core/infrastructure/store/payments/payment.store.ts
import { create } from 'zustand';
import { PaymentModel, PaymentQueryParams } from '@core/domain/models/payments/list.model';
import { paymentService } from '@core/services/payment.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';

// สถานะของ Payment Store
interface PaymentState {
  // สถานะทั่วไป
  items: PaymentModel[];
  isLoading: boolean;
  filters: PaymentQueryParams;
  stats: {
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    refundedPayments: number;
    totalAmount: number;
  };
  
  // สถานะฟอร์ม
  isVisible: boolean;
  selectedItem: PaymentModel | null;
  
  // ฟังก์ชันจัดการรายการ
  setFilters: (filters: PaymentQueryParams) => void;
  setItems: (items: PaymentModel[]) => void;
  addItem: (item: PaymentModel) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: PaymentModel) => void;
  fetchItems: (params?: PaymentQueryParams) => Promise<void>;
  fetchItemById: (id: number) => Promise<PaymentModel | null>;
  fetchStats: () => Promise<void>;
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => void;
  setSelectedItem: (item: PaymentModel | null) => void;
  
  // ฟังก์ชันพิเศษสำหรับ Payment
  refundPayment: (id: number) => Promise<void>;
  
  reset: () => void;
}

// สร้าง Zustand store
export const usePaymentStore = create<PaymentState>((set, get) => ({
  // สถานะเริ่มต้น
  items: [],
  isLoading: false,
  filters: {},
  stats: {
    totalPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    refundedPayments: 0,
    totalAmount: 0,
  },
  isVisible: false,
  selectedItem: null,
  
  // ฟังก์ชันจัดการรายการ Payment
  setFilters: (filters: PaymentQueryParams) => {
    set({ filters });
  },
  
  setItems: (items: PaymentModel[]) => {
    set({ items });
  },
  
  addItem: (item: PaymentModel) => {
    set(state => ({ items: [...state.items, item] }));
  },
  
  removeItem: (id: number) => {
    set(state => ({ items: state.items.filter(item => item.PaymentId !== id) }));
  },
  
  updateItem: (id: number, updatedItem: PaymentModel) => {
    set(state => ({
      items: state.items.map(item => 
        item.PaymentId === id ? updatedItem : item
      )
    }));
  },
  
  fetchItems: async (params?: PaymentQueryParams) => {
    try {
      set({ isLoading: true });
      useLoadingStore.getState().setLoading(true);
      
      console.log('PaymentStore: Fetching payments with params:', params);
      const items = await paymentService.getMany(params || get().filters);
      
      console.log('PaymentStore: Fetched payments:', items);
      set({ items, isLoading: false });
      useLoadingStore.getState().setLoading(false);
    } catch (error: any) {
      console.error('PaymentStore: Error fetching payments:', error);
      set({ isLoading: false });
      useLoadingStore.getState().setLoading(false);
      useErrorStore.getState().setError('ไม่สามารถโหลดข้อมูลการชำระเงินได้: ' + error.message);
      throw error;
    }
  },
  
  fetchItemById: async (id: number): Promise<PaymentModel | null> => {
    try {
      console.log('PaymentStore: Fetching payment by ID:', id);
      const item = await paymentService.getOne(id);
      
      console.log('PaymentStore: Fetched payment:', item);
      set({ selectedItem: item });
      return item;
    } catch (error: any) {
      console.error('PaymentStore: Error fetching payment by ID:', error);
      useErrorStore.getState().setError('ไม่สามารถโหลดรายละเอียดการชำระเงินได้: ' + error.message);
      return null;
    }
  },
  
  fetchStats: async () => {
    try {
      console.log('PaymentStore: Fetching payment statistics');
      const stats = await paymentService.getStats();
      
      console.log('PaymentStore: Fetched payment stats:', stats);
      set({ stats });
    } catch (error: any) {
      console.error('PaymentStore: Error fetching payment statistics:', error);
      useErrorStore.getState().setError('ไม่สามารถโหลดสถิติการชำระเงินได้: ' + error.message);
      throw error;
    }
  },
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => {
    set({ isVisible: visible });
  },
  
  setSelectedItem: (item: PaymentModel | null) => {
    set({ selectedItem: item });
  },
  
  // ฟังก์ชันพิเศษสำหรับ Payment
  refundPayment: async (id: number) => {
    try {
      set({ isLoading: true });
      useLoadingStore.getState().setLoading(true);
      
      console.log('PaymentStore: Processing refund for payment ID:', id);
      
      // TODO: Implement refund API call when backend supports it
      // For now, just simulate success
      console.log('PaymentStore: Refund processed successfully (simulated)');
      
      // Refresh payments after refund
      await get().fetchItems();
      await get().fetchStats();
      
      set({ isLoading: false });
      useLoadingStore.getState().setLoading(false);
    } catch (error: any) {
      console.error('PaymentStore: Error processing refund:', error);
      set({ isLoading: false });
      useLoadingStore.getState().setLoading(false);
      useErrorStore.getState().setError('ไม่สามารถคืนเงินได้: ' + error.message);
      throw error;
    }
  },
  
  reset: () => {
    set({
      items: [],
      isLoading: false,
      filters: {},
      stats: {
        totalPayments: 0,
        paidPayments: 0,
        pendingPayments: 0,
        refundedPayments: 0,
        totalAmount: 0,
      },
      isVisible: false,
      selectedItem: null,
    });
  }
}));
