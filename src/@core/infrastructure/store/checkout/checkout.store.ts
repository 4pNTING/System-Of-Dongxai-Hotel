// src/core/infrastructure/store/checkout/checkout.store.ts (FIXED)
import { create } from 'zustand';
import { CheckOut } from '@core/domain/models/check-out/list.model';
import { checkOutService } from '@core/services/checkout.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';
import { CheckOutInput } from '@core/domain/models/check-out/form.model';

// ===== Interface Definition =====
interface CheckOutState {
  // สถานะทั่วไป
  items: CheckOut[];
  todayCheckOuts: CheckOut[];
  stats: {
    totalCheckOuts: number;
    checkOutsToday: number;
    averageStayDuration: number;
    totalRevenue: number;
  } | null;
  isLoading: boolean;
  filters: Record<string, any>;
  
  // สถานะฟอร์ม
  isVisible: boolean;
  isFormVisible: boolean;
  isSubmitting: boolean;
  selectedItem: CheckOut | null;
  
  // ฟังก์ชันจัดการรายการ
  setFilters: (filters: Record<string, any>) => void;
  setItems: (items: CheckOut[]) => void;
  addItem: (item: CheckOut) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: CheckOut) => void;
  fetchItems: () => Promise<void>;
  fetchTodayCheckOuts: () => Promise<void>;
  fetchStats: () => Promise<void>;
  delete: (id: number) => Promise<void>;
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => void;
  setFormVisible: (visible: boolean) => void;
  setSelectedItem: (item: CheckOut | null) => void;
  create: (data: CheckOutInput) => Promise<CheckOut>;
  update: (id: number, data: CheckOutInput) => Promise<CheckOut>;
  
  // Workflow methods
  checkoutCheckIn: (checkInId: number, staffId: number) => Promise<CheckOut>;
  
  // Query methods
  findByCheckInId: (checkInId: number) => Promise<CheckOut | null>;
  
  // Debug methods
  debug: () => Promise<void>;
  
  reset: () => void;
  resetForm: () => void;
}

// ===== Store Implementation =====
const useCheckOutStore = create<CheckOutState>((set, get) => ({
  // สถานะเริ่มต้น
  items: [],
  todayCheckOuts: [],
  stats: null,
  isLoading: false,
  filters: {},
  
  // สถานะฟอร์ม
  isVisible: false,
  isFormVisible: false,
  isSubmitting: false,
  selectedItem: null,
  
  // ฟังก์ชันจัดการรายการ
  setFilters: (filters: Record<string, any>) => {
    console.log('🔧 Store: Setting filters:', filters);
    set({ filters });
  },
  
  setItems: (items: CheckOut[]) => {
    console.log('📝 Store: Setting items:', items.length, 'checkout records');
    set({ items });
  },
  
  addItem: (item: CheckOut) => {
    console.log('➕ Store: Adding checkout item:', item.CheckOutId);
    set((state) => ({
      items: [...state.items, item]
    }));
  },
  
  removeItem: (id: number) => {
    console.log('➖ Store: Removing checkout item:', id);
    set((state) => ({
      items: state.items.filter((item) => item.CheckOutId !== id)
    }));
  },
  
  updateItem: (id: number, updatedItem: CheckOut) => {
    console.log('✏️ Store: Updating checkout item:', id);
    set((state) => ({
      items: state.items.map((item) => 
        item.CheckOutId === id ? { ...item, ...updatedItem } : item
      )
    }));
  },
  
  fetchItems: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('📋 Store: Starting fetchItems with query data...');
      console.log('🕐 Timestamp:', new Date().toISOString());
      
      setLoading(true);
      set({ isLoading: true });
      
      console.log('🔗 Store: Calling checkOutService.getMany()');
      const allCheckoutData = await checkOutService.getMany();
      
      console.log('✅ Store: Fetched checkout data successfully:', {
        totalRecords: allCheckoutData?.length || 0,
        type: typeof allCheckoutData
      });
      
      // Separate completed checkouts and currently staying guests
      const completedCheckouts = allCheckoutData.filter(item => item.CheckOutDate !== null);
      const currentlyStaying = allCheckoutData.filter(item => item.CheckOutDate === null); // ✅ จัดเรียงแล้ว
      
      console.log('🔄 Store: Data separated:', {
        completedCheckouts: completedCheckouts.length,
        currentlyStaying: currentlyStaying.length
      });
      
      // Combine both arrays and mark with type for UI components
      const combinedItems = [
        // Currently staying guests first (marked as 'checkin' type)
        ...currentlyStaying.map(item => ({
          ...item,
          type: 'checkin', // For CheckOutStatusChip and CheckOutActionButtons
          status: 'checked_in' // Status for the UI
        })),
        // Completed checkouts second (marked as 'checkout' type)
        ...completedCheckouts.map(item => ({
          ...item,
          type: 'checkout',
          status: 'completed'
        }))
      ];
      
      console.log('🔄 Store: Combined items:', {
        totalCombined: combinedItems.length,
        currentlyStaying: currentlyStaying.length,
        completed: completedCheckouts.length
      });
      
      set({ 
        items: combinedItems,
        isLoading: false 
      });
      setLoading(false);
      
    } catch (error: any) {
      console.error('❌ Store: Error fetching management data:', error);
      console.error('❌ Store: Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        stack: error.stack
      });
      
      set({ isLoading: false, items: [] });
      setLoading(false);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch checkout management data';
      setError(errorMessage);
      
      // แจ้งเตือนใน console
      console.warn('⚠️ Store: Setting empty array due to error');
    }
  },

  fetchTodayCheckOuts: async () => {
    try {
      console.log('📅 Store: Fetching today check-outs...');
      
      const data = await checkOutService.getTodayCheckOuts();
      
      console.log('✅ Store: Fetched today check-outs:', {
        count: data?.length || 0,
        data: data?.slice(0, 3) || []
      });
      
      const safeData = Array.isArray(data) ? data : [];
      set({ todayCheckOuts: safeData });
      
    } catch (error: any) {
      console.error('❌ Store: Error fetching today check-outs:', error);
      set({ todayCheckOuts: [] });
    }
  },

  fetchStats: async () => {
    try {
      console.log('📊 Store: Fetching check-out stats...');
      
      const stats = await checkOutService.getStats();
      
      console.log('✅ Store: Fetched stats:', stats);
      set({ stats });
      
    } catch (error: any) {
      console.error('❌ Store: Error fetching check-out stats:', error);
      
      // Set default stats on error
      const defaultStats = {
        totalCheckOuts: 0,
        checkOutsToday: 0,
        averageStayDuration: 0,
        totalRevenue: 0
      };
      
      console.log('⚠️ Store: Setting default stats due to error');
      set({ stats: defaultStats });
    }
  },
  
  delete: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('🗑️ Store: Deleting check-out:', id);
      setLoading(true);
      
      await checkOutService.delete(id);
      get().removeItem(id);
      
      console.log('✅ Store: Check-out deleted successfully');
      setLoading(false);
      
    } catch (error: any) {
      console.error('❌ Store: Error deleting check-out:', error);
      setLoading(false);
      setError(error.message || 'Failed to delete check-out');
      throw error;
    }
  },
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => {
    console.log('👁️ Store: Setting visible:', visible);
    set({ isVisible: visible });
  },
  
  setFormVisible: (visible: boolean) => {
    console.log('📝 Store: Setting form visible:', visible);
    set({ isFormVisible: visible });
  },
  
  setSelectedItem: (item: CheckOut | null) => {
    console.log('🎯 Store: Setting selected item:', item?.CheckOutId || null);
    set({ selectedItem: item });
  },
  
  create: async (data: CheckOutInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('➕ Store: Creating check-out:', data);
      set({ isSubmitting: true });
      setLoading(true);
      
      const newItem = await checkOutService.create(data);
      get().addItem(newItem);
      
      set({
        isSubmitting: false,
        isVisible: false,
        isFormVisible: false,
        selectedItem: null
      });
      
      console.log('✅ Store: Check-out created successfully:', newItem);
      setLoading(false);
      return newItem;
      
    } catch (error: any) {
      console.error('❌ Store: Error creating check-out:', error);
      set({ isSubmitting: false });
      setLoading(false);
      setError(error.message || 'Failed to create check-out');
      throw error;
    }
  },
  
  update: async (id: number, data: CheckOutInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('✏️ Store: Updating check-out:', id, data);
      set({ isSubmitting: true });
      setLoading(true);
      
      const updatedItem = await checkOutService.update(id, data);
      get().updateItem(id, updatedItem);
      
      set({
        isSubmitting: false,
        isVisible: false,
        isFormVisible: false,
        selectedItem: null
      });
      
      console.log('✅ Store: Check-out updated successfully:', updatedItem);
      setLoading(false);
      return updatedItem;
      
    } catch (error: any) {
      console.error('❌ Store: Error updating check-out:', error);
      set({ isSubmitting: false });
      setLoading(false);
      setError(error.message || 'Failed to update check-out');
      throw error;
    }
  },

  // Workflow methods
  checkoutCheckIn: async (checkInId: number, staffId: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      console.log('🚪 Store: Starting check-out process');
      console.log('🏨 Check-in ID:', checkInId);
      console.log('👤 Staff ID:', staffId);
      
      set({ isLoading: true });
      setLoading(true);
      
      const newCheckOut = await checkOutService.checkoutCheckIn(checkInId, staffId);
      
      console.log('✅ Store: Check-out successful:', newCheckOut);
      
      // เพิ่มข้อมูล check-out ใหม่เข้า store
      get().addItem(newCheckOut);
      
      set({ isLoading: false });
      setLoading(false);
      
      return newCheckOut;
      
    } catch (error: any) {
      console.error('❌ Store: Check-out failed:', error);
      
      set({ isLoading: false });
      setLoading(false);
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      const errorStatus = error.response?.status;
      
      console.error('❌ Store: Detailed error:', {
        message: errorMessage,
        status: errorStatus,
        checkInId: checkInId,
        staffId: staffId,
        url: error.config?.url,
        method: error.config?.method
      });
      
      setError(`Check-out failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  },

  // Query methods
  findByCheckInId: async (checkInId: number) => {
    try {
      console.log('🔍 Store: Finding check-out by check-in ID:', checkInId);
      
      const checkOut = await checkOutService.findByCheckInId(checkInId);
      
      console.log('✅ Store: Found check-out:', checkOut);
      return checkOut;
      
    } catch (error: any) {
      console.error('❌ Store: Error finding check-out by check-in ID:', error);
      throw error;
    }
  },

  // Debug method
  debug: async () => {
    try {
      console.log('🔧 Store: === DEBUG CHECKOUT STORE ===');
      
      const currentState = get();
      console.log('📊 Current store state:', {
        itemsCount: currentState.items.length,
        items: currentState.items.slice(0, 3), // แสดงแค่ 3 รายการแรก
        todayCheckOutsCount: currentState.todayCheckOuts.length,
        stats: currentState.stats,
        isLoading: currentState.isLoading,
        filters: currentState.filters,
        isVisible: currentState.isVisible,
        selectedItem: currentState.selectedItem?.CheckOutId || null
      });
      
      console.log('🔧 Testing store methods...');
      
      // Test service connection
      console.log('🧪 Testing checkOutService.getMany()...');
      try {
        const testData = await checkOutService.getMany();
        console.log('✅ Service test passed:', {
          count: testData?.length || 0,
          type: typeof testData,
          isArray: Array.isArray(testData)
        });
      } catch (serviceError) {
        console.error('❌ Service test failed:', serviceError);
      }
      
      console.log('🔧 Store debug completed');
      
    } catch (error) {
      console.error('❌ Store debug failed:', error);
    }
  },
  
  reset: () => {
    console.log('🔄 Store: Resetting check-out store');
    set({  
      isVisible: false,
      isSubmitting: false,
      selectedItem: null,
      filters: {}
    });
  },
  
  resetForm: () => {
    console.log('🔄 Store: Resetting check-out form');
    set({ 
      isFormVisible: false,
      isSubmitting: false,
      selectedItem: null 
    });
  }
}));

// ===== CRITICAL: Proper Export =====
export { useCheckOutStore };

// ===== Additional Debug Export =====
export const checkOutStoreActions = {
  getState: () => useCheckOutStore.getState(),
  debug: () => useCheckOutStore.getState().debug(),
  forceRefresh: () => useCheckOutStore.getState().fetchItems()
};

// ===== Type Export =====
export type { CheckOutState };