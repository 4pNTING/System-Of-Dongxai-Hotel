import { RoomWithGallery } from "@core/domain/models/room-gallery/list.model";
import { CustomerBookingRepositoryPort } from "@core/interface/repositoriesport/customer-booking.port";
import { BookingInput, CustomerBookingInput } from "@core/domain/models/booking/form.model"; // ✅ เพิ่ม CustomerBookingInput
import { Booking } from "@core/domain/models/booking/list.model";

export class CustomerBookingUseCase {
  constructor(private readonly repository: CustomerBookingRepositoryPort) {}

  // ✅ ดึงข้อมูลห้องพักพร้อม Gallery สำหรับลูกค้า
  async executeGetRoomsForBooking(): Promise<RoomWithGallery[]> {
    try {
     
      return await this.repository.getRoomsForBooking();
    } catch (error) {
      console.error('❌ UseCase: Error getting rooms for booking:', error);
      throw error;
    }
  }

  // ✅ ดึงข้อมูลห้องพักเฉพาะห้องพร้อม Gallery
  async executeGetRoomDetail(roomId: number): Promise<RoomWithGallery> {
    try {
     
      return await this.repository.getRoomDetail(roomId);
    } catch (error) {
      console.error('❌ UseCase: Error getting room detail:', error);
      throw error;
    }
  }

  // ✅ ค้นหาห้องพักตามเงื่อนไข
  async executeSearchRooms(searchParams: {
    checkinDate?: string;
    checkoutDate?: string;
    guests?: number;
    priceMin?: number;
    priceMax?: number;
    roomType?: string;
  }): Promise<RoomWithGallery[]> {
    try {
      
      return await this.repository.searchRooms(searchParams);
    } catch (error) {
      console.error(' UseCase: Error searching rooms:', error);
      throw error;
    }
  }

  // จองห้องพัก - เปลี่ยนเป็น CustomerBookingInput
  async executeBookRoom(data: CustomerBookingInput): Promise<Booking> {
    try {
      
      return await this.repository.bookRoom(data);
    } catch (error) {
      console.error(' UseCase: Error booking room:', error);
      throw error;
    }
  }

  // จองห้องพักพร้อมอัปโหลดไฟล์ - One-step API
  async executeBookRoomWithFile(formData: FormData): Promise<Booking> {
    try {
      
      return await this.repository.bookRoomWithFile(formData);
    } catch (error) {
      console.error(' UseCase: Error booking room with file:', error);
      throw error;
    }
  }

  // ดึงประวัติการจองของลูกค้า
  async executeGetBookingHistory(customerId: number): Promise<Booking[]> {
    try {
      
      return await this.repository.getBookingHistory(customerId);
    } catch (error) {
      console.error('❌ UseCase: Error getting booking history:', error);
      throw error;
    }
  }

  // ✅ ดึงรายละเอียดการจอง
  async executeGetBookingDetail(bookingId: number): Promise<Booking> {
    try {
      
      return await this.repository.getBookingDetail(bookingId);
    } catch (error) {
      console.error('❌ UseCase: Error getting booking detail:', error);
      throw error;
    }
  }

  // ✅ ยกเลิกการจอง
  async executeCancelBooking(bookingId: number): Promise<Booking> {
    try {
      
      return await this.repository.cancelBooking(bookingId);
    } catch (error) {
      console.error('❌ UseCase: Error canceling booking:', error);
      throw error;
    }
  }
}