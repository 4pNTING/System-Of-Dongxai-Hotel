// src/core/interface/repositoriesport/customer-booking.port.ts
import { RoomWithGallery } from "@core/domain/models/room-gallery/list.model";
import { BookingInput, CustomerBookingInput } from "@core/domain/models/booking/form.model";
import { Booking } from "@core/domain/models/booking/list.model";

export interface CustomerBookingRepositoryPort {
  // Room Gallery Methods
  getRoomsForBooking(): Promise<RoomWithGallery[]>;
  getRoomDetail(roomId: number): Promise<RoomWithGallery>;
  searchRooms(searchParams: {
    checkinDate?: string;
    checkoutDate?: string;
    guests?: number;
    priceMin?: number;
    priceMax?: number;
    roomType?: string;
  }): Promise<RoomWithGallery[]>;

  // ✅ Booking Methods - เปลี่ยนเป็น CustomerBookingInput
  bookRoom(data: CustomerBookingInput): Promise<Booking>;
  bookRoomWithFile(formData: FormData): Promise<Booking>;
  getBookingHistory(customerId: number): Promise<Booking[]>;
  getBookingDetail(bookingId: number): Promise<Booking>;
  cancelBooking(bookingId: number): Promise<Booking>;
}