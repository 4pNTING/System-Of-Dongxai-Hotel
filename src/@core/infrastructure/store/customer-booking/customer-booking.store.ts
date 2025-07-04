// src/core/infrastructure/store/customer-booking/customer-booking.store.ts
import { create } from 'zustand';
import { RoomWithGallery } from '@core/domain/models/room-gallery/list.model';
import { Booking } from '@core/domain/models/booking/list.model';
import { BookingInput } from '@core/domain/models/booking/form.model';
import { customerBookingService } from '@core/services/customer-booking.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';

interface CustomerBookingState {
  // สถานะข้อมูลห้องพัก
  rooms: RoomWithGallery[];
  selectedRoom: RoomWithGallery | null;
  searchFilters: {
    checkinDate: string;
    checkoutDate: string;
    priceMax: string;
  };
  
  // สถานะการจอง
  bookings: Booking[];
  selectedBooking: Booking | null;
  
  // สถานะการโหลด
  isLoading: boolean;
  isBooking: boolean;
  
  // ฟังก์ชันจัดการห้องพัก
  fetchRooms: () => Promise<void>;
  fetchRoomDetail: (roomId: number) => Promise<void>;
  searchRooms: (searchParams?: any) => Promise<void>;
  setSearchFilters: (filters: Partial<CustomerBookingState['searchFilters']>) => void;
  clearSearchFilters: () => void;
  
  // ฟังก์ชันจัดการการจอง
  bookRoom: (data: BookingInput) => Promise<Booking>;
  fetchBookingHistory: (customerId: number) => Promise<void>;
  fetchBookingDetail: (bookingId: number) => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
  
  // Helper functions
  setSelectedRoom: (room: RoomWithGallery | null) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  reset: () => void;
}

const initialSearchFilters = {
  checkinDate: '',
  checkoutDate: '',
  priceMax: ''
};

export const useCustomerBookingStore = create<CustomerBookingState>((set, get) => ({
  // สถานะเริ่มต้น
  rooms: [],
  selectedRoom: null,
  searchFilters: initialSearchFilters,
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  isBooking: false,
  
  // ✅ ดึงข้อมูลห้องพักทั้งหมด
  fetchRooms: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      console.log('🏨 Store: Fetching rooms for booking...');
      const rooms = await customerBookingService.getRoomsForBooking();
      
      // Process rooms to ensure proper gallery formatting
      const processedRooms = rooms.map(room => ({
        ...room,
        primaryImage: room.galleries?.find(img => img.IsPrimary) || room.galleries?.[0],
        averageRating: calculateAverageRating(room.galleries || []),
        reviewCount: room.galleries?.length || 0
      }));
      
      console.log('✅ Store: Rooms fetched successfully:', processedRooms.length, 'items');
      
      set({ rooms: processedRooms, isLoading: false });
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Store: Error fetching rooms:', error);
      set({ isLoading: false });
      setLoading(false);
      setError(error.message || 'Failed to fetch rooms');
    }
  },

  // ✅ ดึงข้อมูลห้องพักเฉพาะห้อง
  fetchRoomDetail: async (roomId: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      console.log('🏨 Store: Fetching room detail for ID:', roomId);
      const room = await customerBookingService.getRoomDetail(roomId);
      
      // Process room data
      const processedRoom = {
        ...room,
        primaryImage: room.galleries?.find(img => img.IsPrimary) || room.galleries?.[0],
        averageRating: calculateAverageRating(room.galleries || []),
        reviewCount: room.galleries?.length || 0
      };
      
      console.log('✅ Store: Room detail fetched successfully:', processedRoom);
      
      set({ selectedRoom: processedRoom, isLoading: false });
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Store: Error fetching room detail:', error);
      set({ isLoading: false });
      setLoading(false);
      setError(error.message || 'Failed to fetch room detail');
    }
  },

  // ✅ ค้นหาห้องพัก
  searchRooms: async (searchParams?: any) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    const { searchFilters } = get();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      const params = searchParams || searchFilters;
      console.log('🔍 Store: Searching rooms with params:', params);
      
      const rooms = await customerBookingService.searchRooms(params);
      
      // Process rooms to ensure proper gallery formatting
      const processedRooms = rooms.map(room => ({
        ...room,
        primaryImage: room.galleries?.find(img => img.IsPrimary) || room.galleries?.[0],
        averageRating: calculateAverageRating(room.galleries || []),
        reviewCount: room.galleries?.length || 0
      }));
      
      console.log('✅ Store: Room search completed:', processedRooms.length, 'rooms found');
      
      set({ rooms: processedRooms, isLoading: false });
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Store: Error searching rooms:', error);
      set({ isLoading: false });
      setLoading(false);
      setError(error.message || 'Failed to search rooms');
    }
  },

  // ✅ ตั้งค่าตัวกรอง
  setSearchFilters: (filters) => {
    set(state => ({
      searchFilters: { ...state.searchFilters, ...filters }
    }));
  },

  // ✅ ล้างตัวกรอง
  clearSearchFilters: () => {
    set({ searchFilters: initialSearchFilters });
  },

  // ✅ จองห้องพัก
  bookRoom: async (data: BookingInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isBooking: true });
      setLoading(true);
      
      console.log('📝 Store: Booking room with data:', data);
      const booking = await customerBookingService.bookRoom(data);
      
      console.log('✅ Store: Room booked successfully:', booking);
      
      // เพิ่มการจองใหม่เข้าไปใน bookings array
      set(state => ({
        bookings: [...state.bookings, booking],
        isBooking: false
      }));
      
      setLoading(false);
      return booking;
    } catch (error: any) {
      console.error('❌ Store: Error booking room:', error);
      set({ isBooking: false });
      setLoading(false);
      setError(error.message || 'Failed to book room');
      throw error;
    }
  },

  // ✅ ดึงประวัติการจอง
  fetchBookingHistory: async (customerId: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      
      console.log('📋 Store: Fetching booking history for customer:', customerId);
      const bookings = await customerBookingService.getBookingHistory(customerId);
      
      console.log('✅ Store: Booking history fetched successfully:', bookings.length, 'items');
      
      set({ bookings });
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Store: Error fetching booking history:', error);
      setLoading(false);
      setError(error.message || 'Failed to fetch booking history');
    }
  },

  // ✅ ดึงรายละเอียดการจอง
  fetchBookingDetail: async (bookingId: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      
      console.log('📋 Store: Fetching booking detail for ID:', bookingId);
      const booking = await customerBookingService.getBookingDetail(bookingId);
      
      console.log('✅ Store: Booking detail fetched successfully:', booking);
      
      set({ selectedBooking: booking });
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Store: Error fetching booking detail:', error);
      setLoading(false);
      setError(error.message || 'Failed to fetch booking detail');
    }
  },

  // ✅ ยกเลิกการจอง
  cancelBooking: async (bookingId: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      
      console.log('❌ Store: Canceling booking for ID:', bookingId);
      const canceledBooking = await customerBookingService.cancelBooking(bookingId);
      
      console.log('✅ Store: Booking canceled successfully:', canceledBooking);
      
      // อัปเดตรายการจองในสเตต
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking.BookingId === bookingId ? canceledBooking : booking
        )
      }));
      
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Store: Error canceling booking:', error);
      setLoading(false);
      setError(error.message || 'Failed to cancel booking');
    }
  },

  // ✅ Helper functions
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  
  // ✅ รีเซ็ต
  reset: () => {
    console.log('🔄 Store: Resetting customer booking store');
    set({
      rooms: [],
      selectedRoom: null,
      searchFilters: initialSearchFilters,
      bookings: [],
      selectedBooking: null,
      isLoading: false,
      isBooking: false
    });
  }
}));

// ✅ Helper function: คำนวณเรทติ้งเฉลี่ย
function calculateAverageRating(galleries: any[]): number {
  if (!galleries || galleries.length === 0) return 0;
  
  const validRatings = galleries
    .map(gallery => parseFloat(gallery.Rating))
    .filter(rating => !isNaN(rating) && rating > 0);
  
  if (validRatings.length === 0) return 0;
  
  return validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
}