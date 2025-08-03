// src/app/domain/models/room/state.model.ts
import { z } from "zod";
import { Room } from "./list.model";
import { RoomFormSchema } from "@core/domain/schemas/room.schema";

type RoomFormInput = z.infer<typeof RoomFormSchema>;

// Interface สำหรับจัดการสถานะของรายการห้องพัก
export interface RoomListState {
  items: Room[];
  isLoading: boolean;
  filters: Record<string, any>;
  stats: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    maintenanceRooms: number;
    outOfOrderRooms: number;
    occupancyRate: number;
  };
  setFilters: (filters: Record<string, any>) => void;
  setItems: (items: Room[]) => void;
  addItem: (item: Room) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: Room) => void;
  fetchItems: () => Promise<void>;
  fetchStats: () => Promise<void>;
  delete: (id: number) => Promise<void>;
}

// Interface สำหรับจัดการสถานะของฟอร์มห้องพัก
export interface RoomFormState {
  isVisible: boolean;
  isSubmitting: boolean;
  selectedItem: Room | null;
  setVisible: (visible: boolean) => void;
  setSelectedItem: (item: Room | null) => void;
  create: (data: RoomFormInput) => Promise<Room>;
  update: (id: number, data: RoomFormInput) => Promise<Room>;
  reset: () => void;
}

// Interface สำหรับจัดการสถานะการค้นหาห้องว่าง
export interface RoomAvailabilityState {
  availableRooms: Room[];
  checkInDate: string;
  checkOutDate: string;
  isSearching: boolean;
  setCheckInDate: (date: string) => void;
  setCheckOutDate: (date: string) => void;
  searchAvailableRooms: () => Promise<void>;
  resetSearch: () => void;
}

// Interface สำหรับจัดการสถานะทั้งหมด (รวม list, form และ availability)
export interface RoomState extends RoomListState, RoomFormState {
  isFormVisible: boolean;
  setFormVisible: (visible: boolean) => void;
  resetForm: () => void;
  
  // สำหรับ Available Rooms
  availableRooms: Room[];
  checkInDate: string;
  checkOutDate: string;
  isSearching: boolean;
  getAvailableRooms: (checkInDate: string, checkOutDate: string) => Promise<Room[]>;
}