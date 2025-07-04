// src/core/services/customer-booking.service.ts
import { RoomWithGallery } from "@/@core/domain/models/room-gallery/list.model";
import { CustomerBookingRepositoryPort } from "@/@core/interface/repositoriesport/customer-booking.port";
import { CustomerBookingUseCase } from "@/@core/use-cases/customer-booking.use-case";
import { Booking } from "@/@core/domain/models/booking/list.model";
import { CustomerBookingRepository } from "@/@core/infrastructure/api/repository/customer-booking.repository";
import { BookingInput, CustomerBookingInput } from "@/@core/domain/models/booking/form.model";
export class CustomerBookingService {
  private useCase: CustomerBookingUseCase;

  constructor(repositoryPort: CustomerBookingRepositoryPort) {
    this.useCase = new CustomerBookingUseCase(repositoryPort);
  }

  // ✅ ดึงข้อมูลห้องพักพร้อม Gallery สำหรับลูกค้า
  async getRoomsForBooking(): Promise<RoomWithGallery[]> {
    return this.useCase.executeGetRoomsForBooking();
  }

  // ✅ ดึงข้อมูลห้องพักเฉพาะห้องพร้อม Gallery
  async getRoomDetail(roomId: number): Promise<RoomWithGallery> {
    return this.useCase.executeGetRoomDetail(roomId);
  }

  // ✅ ค้นหาห้องพักตามเงื่อนไข (ลดพารามิเตอร์ให้ตรงกับที่ใช้จริง)
  async searchRooms(searchParams: {
    checkinDate?: string;
    checkoutDate?: string;
    priceMax?: number;
  }): Promise<RoomWithGallery[]> {
    return this.useCase.executeSearchRooms(searchParams);
  }

  
  async bookRoom(data: CustomerBookingInput): Promise<Booking> {
    return this.useCase.executeBookRoom(data);
  }

  // ✅ ดึงประวัติการจองของลูกค้า
  async getBookingHistory(customerId: number): Promise<Booking[]> {
    return this.useCase.executeGetBookingHistory(customerId);
  }

  // ✅ ดึงรายละเอียดการจอง
  async getBookingDetail(bookingId: number): Promise<Booking> {
    return this.useCase.executeGetBookingDetail(bookingId);
  }

  // ✅ ยกเลิกการจอง
  async cancelBooking(bookingId: number): Promise<Booking> {
    return this.useCase.executeCancelBooking(bookingId);
  }
}

const repository = new CustomerBookingRepository();
export const customerBookingService = new CustomerBookingService(repository);