// src/core/domain/store/bookings/booking.store.ts
import { create } from 'zustand';
import { Booking } from '@core/domain/models/booking/list.model';
import { bookingService } from '@core/services/booking.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';
import { BookingInput } from '@core/domain/models/booking/form.model';

// สถานะของ Store
interface BookingState {
  [x: string]: any;
  // สถานะทั่วไป
  items: Booking[];
  isLoading: boolean;
  filters: Record<string, any>;
  
  // สถานะฟอร์ม
  isVisible: boolean;
  isFormVisible: boolean;
  isSubmitting: boolean;
  selectedItem: Booking | null;
  
  // ฟังก์ชันจัดการรายการ
  setFilters: (filters: Record<string, any>) => void;
  setItems: (items: Booking[]) => void;
  addItem: (item: Booking) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: Booking) => void;
  fetchItems: () => Promise<void>;
  delete: (id: number) => Promise<void>;
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => void;
  setFormVisible: (visible: boolean) => void;
  setSelectedItem: (item: Booking | null) => void;
  create: (data: BookingInput) => Promise<Booking>;
  update: (id: number, data: BookingInput) => Promise<Booking>;
  
  // เพิ่มฟังก์ชันยืนยันการจอง
  confirmBooking: (id: number) => Promise<Booking>;
  
  reset: () => void;
  resetForm: () => void;
}

// สร้าง Zustand store
export const useBookingStore = create<BookingState>((set, get) => ({
  // สถานะเริ่มต้น
  items: [],
  isLoading: false,
  filters: {},
  
  // สถานะฟอร์ม
  isVisible: false,
  isFormVisible: false,
  isSubmitting: false,
  selectedItem: null,
  
  // ฟังก์ชันจัดการรายการการจอง
  setFilters: (filters: Record<string, any>) => set({ filters }),
  
  setItems: (items: Booking[]) => set({ items }),
  
  addItem: (item: Booking) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id: number) => set((state) => ({
    items: state.items.filter((item) => item.BookingId !== id)
  })),
  
  updateItem: (id: number, updatedItem: Booking) => set((state) => ({
    items: state.items.map((item) => 
      item.BookingId === id ? { ...item, ...updatedItem } : item
    )
  })),
  
  fetchItems: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      const data = await bookingService.getMany();
      set({ items: data, isLoading: false });
      
      setLoading(false);
    } catch (error: any) {
      set({ isLoading: false });
      setLoading(false);
      setError(error.message || 'Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    }
  },
  
  delete: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      await bookingService.delete(id);
      get().removeItem(id);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'Failed to delete booking');
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  fetchBookingById: async (id: number) => {
    try {
      // ตรวจสอบว่ามีข้อมูลใน store แล้วหรือไม่
      const existingBooking = get().items.find(booking => booking.BookingId === id);
      if (existingBooking) {
        return existingBooking;
      }
      
      // ถ้าไม่มีให้ดึงจาก API
      return await bookingService.getOne(id);
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },
  
  // ฟังก์ชันจัดการฟอร์มการจอง
  setVisible: (visible: boolean) => set({ isVisible: visible }),
  setFormVisible: (visible: boolean) => set({ isFormVisible: visible }),
  
  setSelectedItem: (item: Booking | null) => set({ selectedItem: item }),
  
  create: async (data: BookingInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSubmitting: true });
      setLoading(true);
      
      const createResponse = await bookingService.create(data as any);
      const completeItem = await bookingService.getOne(createResponse.BookingId);
      
      get().addItem(completeItem);
      
      set({
        isSubmitting: false,
        isVisible: false,
        isFormVisible: false,
        selectedItem: null
      });
      
      setLoading(false);
      return completeItem;
    } catch (error: any) {
      set({ isSubmitting: false });
      setLoading(false);
      setError(error.message || 'Failed to create booking');
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  update: async (id: number, data: BookingInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSubmitting: true });
      setLoading(true);
      
      await bookingService.update(id, data);
      
      // ดึงข้อมูลใหม่จาก API หลังจากอัปเดต
      const updatedItem = await bookingService.getOne(id);
      get().updateItem(id, updatedItem);
      
      set({
        isSubmitting: false,
        isVisible: false,
        isFormVisible: false,
        selectedItem: null
      });
      
      setLoading(false);
      return updatedItem;
    } catch (error: any) {
      set({ isSubmitting: false });
      setLoading(false);
      setError(error.message || 'Failed to update booking');
      console.error('Error updating booking:', error);
      throw error;
    }
  },
  
confirmBooking: async (id: number) => {
  const { setLoading } = useLoadingStore.getState();
  const { setError } = useErrorStore.getState();
  
  try {
    set({ isLoading: true });
    setLoading(true);
    
    // ข้อมูลสำหรับอัพเดตสถานะ
    const updateData = {
      StatusId: 2 // เปลี่ยนจาก "รอการยืนยัน" (8) เป็น "ยืนยันแล้ว" (2)
      // สามารถปรับ StatusId ตามที่ใช้ในระบบของคุณ
    };
    
    const updatedItem = await get().update(id, updateData as any);
    
    set({ isLoading: false });
    setLoading(false);
    
    return updatedItem;
  } catch (error: any) {
    set({ isLoading: false });
    setLoading(false);
    setError(error.message || 'Failed to confirm booking');
    console.error('Error confirming booking:', error);
    throw error;
  }
},
  
  reset: () => set({  
    isVisible: false,
    isSubmitting: false,
    selectedItem: null 
  }),
  
  resetForm: () => set({ 
    isFormVisible: false,
    isSubmitting: false,
    selectedItem: null 
  })
}));