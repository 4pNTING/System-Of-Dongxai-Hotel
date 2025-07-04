// src/core/infrastructure/store/checkin/checkin.store.ts
import { create } from 'zustand';
import { CheckIn } from '@core/domain/models/check-in/list.model';
import { checkInService } from '@core/services/checkin.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';
import { CheckInInput } from '@core/domain/models/check-in/form.model';

interface CheckInState {
  // สถานะทั่วไป
  items: CheckIn[];
  currentCheckIns: CheckIn[];
  stats: {
    totalCheckIns: number;
    currentGuests: number;
    checkInsToday: number;
    expectedCheckOuts: number;
  } | null;
  isLoading: boolean;
  filters: Record<string, any>;
  
  // สถานะฟอร์ม
  isVisible: boolean;
  isFormVisible: boolean;
  isSubmitting: boolean;
  selectedItem: CheckIn | null;
  
  // ฟังก์ชันจัดการรายการ
  setFilters: (filters: Record<string, any>) => void;
  setItems: (items: CheckIn[]) => void;
  addItem: (item: CheckIn) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: CheckIn) => void;
  fetchItems: () => Promise<void>;
  fetchCurrentCheckIns: () => Promise<void>;
  fetchStats: () => Promise<void>;
  delete: (id: number) => Promise<void>;
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => void;
  setFormVisible: (visible: boolean) => void;
  setSelectedItem: (item: CheckIn | null) => void;
  create: (data: CheckInInput) => Promise<CheckIn>;
  update: (id: number, data: CheckInInput) => Promise<CheckIn>;
  
  // Workflow methods (เฉพาะ checkin)
  checkinBooking: (bookingId: number) => Promise<CheckIn>;
  
  // Query methods
  findByBookingId: (bookingId: number) => Promise<CheckIn | null>;
  findByCustomerId: (customerId: number) => Promise<CheckIn[]>;
  
  reset: () => void;
  resetForm: () => void;
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  // สถานะเริ่มต้น
  items: [],
  currentCheckIns: [],
  stats: null,
  isLoading: false,
  filters: {},
  
  // สถานะฟอร์ม
  isVisible: false,
  isFormVisible: false,
  isSubmitting: false,
  selectedItem: null,
  
  // ฟังก์ชันจัดการรายการ
  setFilters: (filters: Record<string, any>) => set({ filters }),
  
  setItems: (items: CheckIn[]) => set({ items }),
  
  addItem: (item: CheckIn) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id: number) => set((state) => ({
    items: state.items.filter((item) => item.CheckInId !== id)
  })),
  
  updateItem: (id: number, updatedItem: CheckIn) => set((state) => ({
    items: state.items.map((item) => 
      item.CheckInId === id ? { ...item, ...updatedItem } : item
    )
  })),
  
  fetchItems: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      console.log('📋 Store: Fetching check-ins...');
      const data = await checkInService.getMany();
      console.log('✅ Store: Fetched check-ins:', data.length, 'items');
      
      set({ items: data, isLoading: false });
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Store: Error fetching check-ins:', error);
      set({ isLoading: false });
      setLoading(false);
      setError(error.message || 'Failed to fetch check-ins');
    }
  },

  fetchCurrentCheckIns: async () => {
    try {
      console.log('📋 Store: Fetching current check-ins...');
      const data = await checkInService.getCurrentCheckIns();
      console.log('✅ Store: Fetched current check-ins:', data.length, 'items');
      set({ currentCheckIns: data });
    } catch (error: any) {
      console.error('❌ Store: Error fetching current check-ins:', error);
    }
  },

  fetchStats: async () => {
    try {
      console.log('📊 Store: Fetching check-in stats...');
      const stats = await checkInService.getStats();
      console.log('✅ Store: Fetched stats:', stats);
      set({ stats });
    } catch (error: any) {
      console.error('❌ Store: Error fetching check-in stats:', error);
    }
  },
  
  delete: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('🗑️ Store: Deleting check-in:', id);
      setLoading(true);
      
      await checkInService.delete(id);
      get().removeItem(id);
      
      console.log('✅ Store: Check-in deleted successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Store: Error deleting check-in:', error);
      setLoading(false);
      setError(error.message || 'Failed to delete check-in');
      throw error;
    }
  },
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => set({ isVisible: visible }),
  setFormVisible: (visible: boolean) => set({ isFormVisible: visible }),
  
  setSelectedItem: (item: CheckIn | null) => set({ selectedItem: item }),
  
  create: async (data: CheckInInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('➕ Store: Creating check-in:', data);
      set({ isSubmitting: true });
      setLoading(true);
      
      const newItem = await checkInService.create(data);
      get().addItem(newItem);
      
      set({
        isSubmitting: false,
        isVisible: false,
        isFormVisible: false,
        selectedItem: null
      });
      
      console.log('✅ Store: Check-in created successfully:', newItem);
      setLoading(false);
      return newItem;
    } catch (error: any) {
      console.error('❌ Store: Error creating check-in:', error);
      set({ isSubmitting: false });
      setLoading(false);
      setError(error.message || 'Failed to create check-in');
      throw error;
    }
  },
  
  update: async (id: number, data: CheckInInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('✏️ Store: Updating check-in:', id, data);
      set({ isSubmitting: true });
      setLoading(true);
      
      const updatedItem = await checkInService.update(id, data);
      get().updateItem(id, updatedItem);
      
      set({
        isSubmitting: false,
        isVisible: false,
        isFormVisible: false,
        selectedItem: null
      });
      
      console.log('✅ Store: Check-in updated successfully:', updatedItem);
      setLoading(false);
      return updatedItem;
    } catch (error: any) {
      console.error('❌ Store: Error updating check-in:', error);
      set({ isSubmitting: false });
      setLoading(false);
      setError(error.message || 'Failed to update check-in');
      throw error;
    }
  },

  // Workflow methods (เฉพาะ checkin)
  checkinBooking: async (bookingId: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('🏨 Store: Starting check-in process for booking:', bookingId);
      
      set({ isLoading: true });
      setLoading(true);
      
      const newCheckIn = await checkInService.checkinBooking(bookingId);
      
      console.log('✅ Store: Check-in successful:', newCheckIn);
      
      // เพิ่มข้อมูล check-in ใหม่เข้า store
      get().addItem(newCheckIn);
      
      set({ isLoading: false });
      setLoading(false);
      
      return newCheckIn;
    } catch (error: any) {
      console.error('❌ Store: Check-in failed:', error);
      
      set({ isLoading: false });
      setLoading(false);
      
      // แสดงข้อมูลเพิ่มเติมใน error
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      const errorStatus = error.response?.status;
      
      console.error('Error details:', {
        message: errorMessage,
        status: errorStatus,
        bookingId: bookingId,
        fullError: error
      });
      
      setError(`Check-in failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  },

  // Query methods
  findByBookingId: async (bookingId: number) => {
    try {
      console.log('🔍 Store: Finding check-in by booking ID:', bookingId);
      const checkIn = await checkInService.findByBookingId(bookingId);
      console.log('✅ Store: Found check-in:', checkIn);
      return checkIn;
    } catch (error: any) {
      console.error('❌ Store: Error finding check-in by booking ID:', error);
      throw error;
    }
  },

  findByCustomerId: async (customerId: number) => {
    try {
      console.log('🔍 Store: Finding check-ins by customer ID:', customerId);
      const checkIns = await checkInService.findByCustomerId(customerId);
      console.log('✅ Store: Found check-ins:', checkIns.length, 'items');
      return checkIns;
    } catch (error: any) {
      console.error('❌ Store: Error finding check-ins by customer ID:', error);
      throw error;
    }
  },
  
  reset: () => {
    console.log('🔄 Store: Resetting check-in store');
    set({  
      isVisible: false,
      isSubmitting: false,
      selectedItem: null 
    });
  },
  
  resetForm: () => {
    console.log('🔄 Store: Resetting check-in form');
    set({ 
      isFormVisible: false,
      isSubmitting: false,
      selectedItem: null 
    });
  }
}));