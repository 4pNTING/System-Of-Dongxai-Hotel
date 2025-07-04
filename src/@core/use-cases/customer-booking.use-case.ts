import { RoomWithGallery } from "@core/domain/models/room-gallery/list.model";
import { CustomerBookingRepositoryPort } from "@core/interface/repositoriesport/customer-booking.port";
import { BookingInput, CustomerBookingInput } from "@core/domain/models/booking/form.model"; // ✅ เพิ่ม CustomerBookingInput
import { Booking } from "@core/domain/models/booking/list.model";

export class CustomerBookingUseCase {
  constructor(private readonly repository: CustomerBookingRepositoryPort) {}

  // ✅ ดึงข้อมูลห้องพักพร้อม Gallery สำหรับลูกค้า
  async executeGetRoomsForBooking(): Promise<RoomWithGallery[]> {
    try {
      console.log('🏨 UseCase: Executing get rooms for booking...');
      return await this.repository.getRoomsForBooking();
    } catch (error) {
      console.error('❌ UseCase: Error getting rooms for booking:', error);
      throw error;
    }
  }

  // ✅ ดึงข้อมูลห้องพักเฉพาะห้องพร้อม Gallery
  async executeGetRoomDetail(roomId: number): Promise<RoomWithGallery> {
    try {
      console.log('🏨 UseCase: Executing get room detail for ID:', roomId);
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
      console.log('🔍 UseCase: Executing room search with params:', searchParams);
      return await this.repository.searchRooms(searchParams);
    } catch (error) {
      console.error('❌ UseCase: Error searching rooms:', error);
      throw error;
    }
  }

  // ✅ จองห้องพัก - เปลี่ยนเป็น CustomerBookingInput
  async executeBookRoom(data: CustomerBookingInput): Promise<Booking> {
    try {
      console.log('📝 UseCase: Executing book room:', data);
      return await this.repository.bookRoom(data);
    } catch (error) {
      console.error('❌ UseCase: Error booking room:', error);
      throw error;
    }
  }

  // ✅ ดึงประวัติการจองของลูกค้า
  async executeGetBookingHistory(customerId: number): Promise<Booking[]> {
    try {
      console.log('📋 UseCase: Executing get booking history for customer:', customerId);
      return await this.repository.getBookingHistory(customerId);
    } catch (error) {
      console.error('❌ UseCase: Error getting booking history:', error);
      throw error;
    }
  }

  // ✅ ดึงรายละเอียดการจอง
  async executeGetBookingDetail(bookingId: number): Promise<Booking> {
    try {
      console.log('📋 UseCase: Executing get booking detail for ID:', bookingId);
      return await this.repository.getBookingDetail(bookingId);
    } catch (error) {
      console.error('❌ UseCase: Error getting booking detail:', error);
      throw error;
    }
  }

  // ✅ ยกเลิกการจอง
  async executeCancelBooking(bookingId: number): Promise<Booking> {
    try {
      console.log('❌ UseCase: Executing cancel booking for ID:', bookingId);
      return await this.repository.cancelBooking(bookingId);
    } catch (error) {
      console.error('❌ UseCase: Error canceling booking:', error);
      throw error;
    }
  }
}