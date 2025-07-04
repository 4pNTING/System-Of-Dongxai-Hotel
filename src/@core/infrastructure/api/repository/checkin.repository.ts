import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { CheckInInput } from "@core/domain/models/check-in/form.model";
import { CheckIn } from "@core/domain/models/check-in/list.model";
import { CheckInRepositoryPort } from "@core/interface/repositoriesport/checkin.port";
import { CHECKIN_ENDPOINTS } from "../config/endpoints.config";
import { CHECKIN_QUERY } from "@core/infrastructure/queries/checkin.query";

export class CheckInRepository implements CheckInRepositoryPort {
    private readonly URL = CHECKIN_ENDPOINTS;

    async getMany(): Promise<CheckIn[]> {
        try {
            const query = CHECKIN_QUERY.LIST.createQuery();
            const response = await api.post<ApiResponse<CheckIn[]>>(this.URL.GET, query);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching check-ins:', error);
            throw error;
        }
    }

    async getOne(id: number): Promise<CheckIn> {
        try {
            const query = CHECKIN_QUERY.DETAIL.createQuery({ CheckInId: id });
            const response = await api.post<ApiResponse<CheckIn>>(this.URL.GET, query);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching check-in details:', error);
            throw error;
        }
    }

    async create(data: CheckInInput): Promise<CheckIn> {
        try {
            const response = await api.post<ApiResponse<CheckIn>>(this.URL.CREATE, data);
            return response.data.data;
        } catch (error) {
            console.error('Error creating check-in:', error);
            throw error;
        }
    }

    async update(id: number, data: Partial<CheckInInput>): Promise<CheckIn> {
        try {
            const response = await api.patch<ApiResponse<CheckIn>>(this.URL.UPDATE(id), data);
            return response.data.data;
        } catch (error) {
            console.error('Error updating check-in:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await api.delete<ApiResponse<void>>(this.URL.DELETE(id));
        } catch (error) {
            console.error('Error deleting check-in:', error);
            throw error;
        }
    }

    async checkinBooking(bookingId: number): Promise<CheckIn> {
        try {
            console.log('🏨 Repository: Processing check-in for booking ID:', bookingId);
            console.log('🔗 Using endpoint:', this.URL.CHECKIN_BOOKING(bookingId));

            // ตอนนี้จะเรียก /check-in/{bookingId}/checkin แทน /check-in/booking/{bookingId}/checkin
            const response = await api.patch<ApiResponse<CheckIn>>(this.URL.CHECKIN_BOOKING(bookingId), {});

            console.log('✅ Repository: Check-in response:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('❌ Repository: Error processing check-in:', error);
            throw error;
        }
    }

    // ===== Query methods =====
    async findByBookingId(bookingId: number): Promise<CheckIn | null> {
        try {
            const response = await api.get<ApiResponse<CheckIn>>(this.URL.BY_BOOKING(bookingId));
            return response.data.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Error finding check-in by booking ID:', error);
            throw error;
        }
    }

    async findByCustomerId(customerId: number): Promise<CheckIn[]> {
        try {
            const response = await api.get<ApiResponse<CheckIn[]>>(this.URL.BY_CUSTOMER(customerId));
            return response.data.data;
        } catch (error) {
            console.error('Error finding check-ins by customer ID:', error);
            throw error;
        }
    }

    async getCurrentCheckIns(): Promise<CheckIn[]> {
        try {
            const response = await api.get<ApiResponse<CheckIn[]>>(this.URL.CURRENT);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching current check-ins:', error);
            throw error;
        }
    }

    async getCheckInStats(): Promise<{
        totalCheckIns: number;
        currentGuests: number;
        checkInsToday: number;
        expectedCheckOuts: number;
    }> {
        try {
            const response = await api.get<ApiResponse<any>>(this.URL.STATS);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching check-in stats:', error);
            throw error;
        }
    }
}