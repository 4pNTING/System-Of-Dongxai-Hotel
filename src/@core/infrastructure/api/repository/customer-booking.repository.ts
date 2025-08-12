// src/core/infrastructure/api/repository/customer-booking.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { CustomerBookingRepositoryPort } from "@core/interface/repositoriesport/customer-booking.port";
import { RoomWithGallery } from "@core/domain/models/room-gallery/list.model";
import { BookingInput, CustomerBookingInput } from "@core/domain/models/booking/form.model";
import { Booking } from "@core/domain/models/booking/list.model";
import { CUSTOMER_BOOKING_ENDPOINTS } from "../config/endpoints.config";

export class CustomerBookingRepository implements CustomerBookingRepositoryPort {
    private readonly URL = CUSTOMER_BOOKING_ENDPOINTS;

    // ✅ ดึงข้อมูลห้องพักพร้อม Gallery สำหรับลูกค้า
    async getRoomsForBooking(): Promise<RoomWithGallery[]> {
        try {
            console.log('🏨 Repository: Fetching rooms for booking...');
            const response = await api.get<ApiResponse<RoomWithGallery[]>>(this.URL.ROOMS);
            console.log('✅ Repository: Rooms fetched successfully:', response.data.data?.length || 0);
            return response.data.data || [];
        } catch (error) {
            console.error('❌ Repository: Error fetching rooms for booking:', error);
            throw error;
        }
    }

    // ✅ ดึงข้อมูลห้องพักเฉพาะห้องพร้อม Gallery
    async getRoomDetail(roomId: number): Promise<RoomWithGallery> {
        try {
            console.log('🏨 Repository: Fetching room detail for ID:', roomId);
            const response = await api.get<ApiResponse<RoomWithGallery>>(this.URL.ROOM_DETAIL(roomId));
            console.log('✅ Repository: Room detail fetched successfully:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('❌ Repository: Error fetching room detail:', error);
            throw error;
        }
    }

    // ✅ ค้นหาห้องพักตามเงื่อนไข
    async searchRooms(searchParams: {
        checkinDate?: string;
        checkoutDate?: string;
        guests?: number;
        priceMin?: number;
        priceMax?: number;
        roomType?: string;
    }): Promise<RoomWithGallery[]> {
        try {
            console.log('🔍 Repository: Searching rooms with params:', searchParams);
            
            const queryParams = new URLSearchParams();
            Object.entries(searchParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });

            const url = `${this.URL.ROOMS}?${queryParams.toString()}`;
            const response = await api.get<ApiResponse<RoomWithGallery[]>>(url);
            
            console.log('✅ Repository: Room search completed:', response.data.data?.length || 0, 'rooms found');
            return response.data.data || [];
        } catch (error) {
            console.error('❌ Repository: Error searching rooms:', error);
            throw error;
        }
    }

    // ✅ จองห้องพัก
    async bookRoom(data: CustomerBookingInput): Promise<Booking> {
        try {
            // ສ່ງເຉພາະ prop ທີ່ backend ຕ້ອງການ
            const payload = {
                RoomId: data.RoomId,
                CheckinDate: data.CheckinDate,
                CheckoutDate: data.CheckoutDate
            };
            console.log('📝 Repository: Booking room with data:', payload);
            const response = await api.post<ApiResponse<Booking>>(this.URL.BOOK, payload);
            console.log('✅ Repository: Room booked successfully:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('❌ Repository: Error booking room:', error);
            throw error;
        }
    }

    // ✅ จองห้องพักพร້ອมອັປໂหลดไฟล໌ - One-step API
    async bookRoomWithFile(formData: FormData): Promise<Booking> {
        try {
            console.log('📦 Repository: Booking room with file upload (FormData)...');
            
            // ສຳຫຼັບ FormData ໃຊ້ api.post ໂດยຕະຫຼັບສ່ງໄປ backend
            const response = await api.post<ApiResponse<Booking>>(this.URL.BOOK, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('✅ Repository: Room booked with file successfully:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('❌ Repository: Error booking room with file:', error);
            throw error;
        }
    }

    // ✅ ดึงประวัติการจองของลูกค้า
    async getBookingHistory(customerId: number): Promise<Booking[]> {
        try {
            console.log('📋 Repository: Fetching booking history for customer:', customerId);
            // Backend expects POST request and extracts customerId from JWT token
            const response = await api.post<ApiResponse<Booking[]>>(this.URL.HISTORY, {});
            console.log('✅ Repository: Booking history fetched successfully:', response.data.data?.length || 0);
            return response.data.data || [];
        } catch (error) {
            console.error('❌ Repository: Error fetching booking history:', error);
            throw error;
        }
    }

    // ✅ ดึงรายละเอียดการจอง
    async getBookingDetail(bookingId: number): Promise<Booking> {
        try {
            console.log('📋 Repository: Fetching booking detail for ID:', bookingId);
            const response = await api.get<ApiResponse<Booking>>(this.URL.BOOKING_DETAIL(bookingId));
            console.log('✅ Repository: Booking detail fetched successfully:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('❌ Repository: Error fetching booking detail:', error);
            throw error;
        }
    }

    // ✅ ยกเลิกการจอง
    async cancelBooking(bookingId: number): Promise<Booking> {
        try {
            console.log('❌ Repository: Canceling booking for ID:', bookingId);
            const response = await api.patch<ApiResponse<Booking>>(this.URL.CANCEL_BOOKING(bookingId), {});
            console.log('✅ Repository: Booking canceled successfully:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('❌ Repository: Error canceling booking:', error);
            throw error;
        }
    }
}