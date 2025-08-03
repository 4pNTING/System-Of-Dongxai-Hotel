import { create } from 'zustand';
import { Room } from '@core/domain/models/rooms/list.model';
import { roomService } from '@core/services/room.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';
import { RoomInput } from '@core/domain/models/rooms/form.model';
import { RoomState } from '@core/domain/models/rooms/state.model';

// สร้าง Zustand store
export const useRoomStore = create<RoomState>((set, get) => ({
  // สถานะเริ่มต้นของรายการห้องพัก
  items: [],
  isLoading: false,
  filters: {},
  stats: {
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    outOfOrderRooms: 0,
    occupancyRate: 0,
  },
  
  // สถานะเริ่มต้นของฟอร์มห้องพัก
  isVisible: false,
  isFormVisible: false,
  isSubmitting: false,
  selectedItem: null,
  
  // สถานะสำหรับการค้นหาห้องว่าง
  availableRooms: [],
  checkInDate: '',
  checkOutDate: '',
  isSearching: false,
  
  // ฟังก์ชันจัดการรายการห้องพัก
  setFilters: (filters: Record<string, any>) => set({ filters }),
  
  setItems: (items: Room[]) => set({ items }),
  
  addItem: (item: Room) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id: number) => set((state) => ({
    items: state.items.filter((item) => item.RoomId !== id)
  })),
  
  updateItem: (id: number, updatedItem: Room) => set((state) => ({
    items: state.items.map((item) => 
      item.RoomId === id ? { ...item, ...updatedItem } : item
    )
  })),
  
  fetchItems: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      const data = await roomService.getMany();
      set({ items: data, isLoading: false });
      
      setLoading(false);
    } catch (error: any) {
      set({ isLoading: false });
      setLoading(false);
      setError(error.message || 'Failed to fetch rooms');
      console.error('Error fetching rooms:', error);
    }
  },

  fetchStats: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      
      const rooms = get().items;
      
      // Calculate room statistics from current room data
      const totalRooms = rooms.length;
      const availableRooms = rooms.filter(room => room.roomStatus?.StatusName === 'Available').length;
      const occupiedRooms = rooms.filter(room => room.roomStatus?.StatusName === 'Occupied').length;
      const maintenanceRooms = rooms.filter(room => room.roomStatus?.StatusName === 'Maintenance').length;
      const outOfOrderRooms = rooms.filter(room => room.roomStatus?.StatusName === 'Out of Order').length;
      
      // Calculate occupancy rate (occupied rooms / total rooms * 100)
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      
      const stats = {
        totalRooms,
        availableRooms,
        occupiedRooms,
        maintenanceRooms,
        outOfOrderRooms,
        occupancyRate,
      };
      
      set({ stats });
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'Failed to fetch room statistics');
      console.error('Error fetching room stats:', error);
    }
  },
  
  delete: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      await roomService.delete(id);
      get().removeItem(id);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'Failed to delete room');
      console.error('Error deleting room:', error);
      throw error;
    }
  },
  
  // ฟังก์ชันจัดการฟอร์มห้องพัก
  setVisible: (visible: boolean) => set({ isVisible: visible }),
  setFormVisible: (visible: boolean) => set({ isFormVisible: visible }),
  
  setSelectedItem: (item: Room | null) => set({ selectedItem: item }),
  
  create: async (data: RoomInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSubmitting: true });
      setLoading(true);
      
      const createResponse = await roomService.create(data as any);
      const completeItem = await roomService.getOne(createResponse.RoomId);
      
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
      setError(error.message || 'Failed to create room');
      console.error('Error creating room:', error);
      throw error;
    }
  },
  
  update: async (id: number, data: RoomInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSubmitting: true });
      setLoading(true);
  
      // ส่งเฉพาะข้อมูลที่จำเป็นไปยัง API
      const updateData = {
        TypeId: data.TypeId,
        StatusId: data.StatusId,
        RoomPrice: data.RoomPrice
      };
      
      // เรียกใช้ API update โดยส่งเฉพาะข้อมูลที่จำเป็น
      await roomService.update(id, updateData);
      
      // ดึงข้อมูลใหม่จาก API หลังจากอัปเดต
      const updatedItem = await roomService.getOne(id);
      get().updateItem(id, updatedItem);
      
      // รีเฟรชข้อมูลเพื่อให้แน่ใจว่าได้ข้อมูลล่าสุด
      await get().fetchItems();
      
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
      setError(error.message || 'Failed to update room');
      console.error('Error updating room:', error);
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
  }),
  
  // ฟังก์ชันค้นหาห้องที่ว่าง
  getAvailableRooms: async (checkInDate: string, checkOutDate: string) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSearching: true, checkInDate, checkOutDate });
      setLoading(true);
      
      const rooms = await roomService.getAvailable(checkInDate, checkOutDate);
      set({ availableRooms: rooms, isSearching: false });
      
      setLoading(false);
      return rooms;
    } catch (error: any) {
      set({ isSearching: false });
      setLoading(false);
      setError(error.message || 'Failed to fetch available rooms');
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  }
}));