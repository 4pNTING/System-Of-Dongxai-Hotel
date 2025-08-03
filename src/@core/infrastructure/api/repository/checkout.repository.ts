// src/core/infrastructure/api/repository/checkout.repository.ts (Fixed)
import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { CheckOutInput } from "@core/domain/models/check-out/form.model";
import { CheckOut } from "@core/domain/models/check-out/list.model";
import { CheckOutRepositoryPort } from "@core/interface/repositoriesport/checkout.port";
import { CHECKOUT_ENDPOINTS } from "../config/endpoints.config";
import { CHECKOUT_QUERY } from "@core/infrastructure/queries/checkout.query";

export class CheckOutRepository implements CheckOutRepositoryPort {
    private readonly URL = CHECKOUT_ENDPOINTS;

    async getMany(): Promise<CheckOut[]> {
        try {
            console.log('🔍 Repository: Fetching checkouts...');
            console.log('🔗 Using endpoint:', this.URL.GET); // Debug endpoint
            
            const query = CHECKOUT_QUERY.LIST.createQuery();
            console.log('📋 Query payload:', query); // Debug query
            
            const response = await api.post<ApiResponse<CheckOut[]>>(this.URL.GET, query);
            
            console.log('✅ Repository: Checkout response:', response.data);
            console.log(`📊 Found ${response.data.data?.length || 0} checkouts`);
            
            return response.data.data || [];
        } catch (error: any) {
            console.error('❌ Repository: Error fetching checkouts:', error);
            console.error('❌ Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url,
                method: error.config?.method
            });
            throw error;
        }
    }

    async getOne(id: number): Promise<CheckOut> {
        try {
            console.log('🔍 Repository: Fetching checkout by ID:', id);
            
            const query = CHECKOUT_QUERY.DETAIL.createQuery({ CheckOutId: id });
            const response = await api.post<ApiResponse<CheckOut>>(this.URL.GET, query);
            
            console.log('✅ Repository: Checkout detail response:', response.data);
            return response.data.data;
        } catch (error: any) {
            console.error('❌ Repository: Error fetching checkout detail:', error);
            throw error;
        }
    }

    async create(data: CheckOutInput): Promise<CheckOut> {
        try {
            console.log('➕ Repository: Creating checkout:', data);
            
            const response = await api.post<ApiResponse<CheckOut>>(this.URL.CREATE, data);
            
            console.log('✅ Repository: Checkout created:', response.data);
            return response.data.data;
        } catch (error: any) {
            console.error('❌ Repository: Error creating checkout:', error);
            throw error;
        }
    }

    async update(id: number, data: Partial<CheckOutInput>): Promise<CheckOut> {
        try {
            console.log('✏️ Repository: Updating checkout:', id, data);
            
            const response = await api.patch<ApiResponse<CheckOut>>(this.URL.UPDATE(id), data);
            
            console.log('✅ Repository: Checkout updated:', response.data);
            return response.data.data;
        } catch (error: any) {
            console.error('❌ Repository: Error updating checkout:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            console.log('🗑️ Repository: Deleting checkout:', id);
            
            await api.delete<ApiResponse<void>>(this.URL.DELETE(id));
            
            console.log('✅ Repository: Checkout deleted successfully');
        } catch (error: any) {
            console.error('❌ Repository: Error deleting checkout:', error);
            throw error;
        }
    }

    async checkoutCheckIn(checkInId: number, staffId: number): Promise<CheckOut> {
        try {
            console.log('🚪 Repository: Processing check-out for check-in ID:', checkInId);
            console.log('👤 Staff ID:', staffId);
            console.log('🔗 Using endpoint:', this.URL.CHECKOUT_CHECKIN(checkInId));

            const payload = { staffId };
            console.log('📦 Payload:', payload);

            const response = await api.post<ApiResponse<CheckOut>>(
                this.URL.CHECKOUT_CHECKIN(checkInId), 
                payload
            );

            console.log('✅ Repository: Check-out response:', response.data);
            return response.data.data;
        } catch (error: any) {
            console.error('❌ Repository: Error processing check-out:', error);
            console.error('❌ Error details:', {
                checkInId,
                staffId,
                url: this.URL.CHECKOUT_CHECKIN(checkInId),
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    }

    // Query methods
    async findByCheckInId(checkInId: number): Promise<CheckOut | null> {
        try {
            console.log('🔍 Repository: Finding checkout by check-in ID:', checkInId);
            
            const response = await api.get<ApiResponse<CheckOut>>(this.URL.BY_CHECKIN(checkInId));
            
            console.log('✅ Repository: Found checkout:', response.data);
            return response.data.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.log('ℹ️ Repository: No checkout found for check-in ID:', checkInId);
                return null;
            }
            console.error('❌ Repository: Error finding checkout by check-in ID:', error);
            throw error;
        }
    }

    async getTodayCheckOuts(): Promise<CheckOut[]> {
        try {
            console.log('🔍 Repository: Fetching today checkouts...');
            console.log('🔗 Using endpoint:', this.URL.TODAY);
            
            const response = await api.get<ApiResponse<CheckOut[]>>(this.URL.TODAY);
            
            console.log('✅ Repository: Today checkouts:', response.data);
            console.log(`📊 Found ${response.data.data?.length || 0} today checkouts`);
            
            return response.data.data || [];
        } catch (error: any) {
            console.error('❌ Repository: Error fetching today checkouts:', error);
            throw error;
        }
    }

    async getCheckOutStats(): Promise<{
        totalCheckOuts: number;
        checkOutsToday: number;
        averageStayDuration: number;
        totalRevenue: number;
    }> {
        try {
            console.log('📊 Repository: Fetching checkout stats...');
            
            const response = await api.get<ApiResponse<{
                totalCheckOuts: number;
                checkOutsToday: number;
                averageStayDuration: number;
                totalRevenue: number;
            }>>(this.URL.STATS);
            
            console.log('✅ Repository: Stats response:', response.data);
            return response.data.data;
        } catch (error: any) {
            console.error('❌ Repository: Error fetching stats:', error);
            throw error;
        }
    }

    // Management methods
    async getManagementData(filters?: {
        dateFrom?: string;
        dateTo?: string;
        roomId?: number;
        customerId?: number;
    }): Promise<{
        completedCheckouts: CheckOut[];
        currentlyStaying: CheckOut[];
        total: number;
    }> {
        try {
            console.log('🏨 Repository: Fetching management data...');
            console.log('📋 Filters:', filters);
            
            const payload = filters || {};
            const response = await api.post<ApiResponse<{
                completedCheckouts: CheckOut[];
                currentlyStaying: CheckOut[];
                total: number;
            }>>(this.URL.MANAGEMENT, payload);
            
            console.log('✅ Repository: Management data response:', {
                completedCount: response.data.data.completedCheckouts.length,
                currentlyStayingCount: response.data.data.currentlyStaying.length,
                total: response.data.data.total
            });
            
            return response.data.data;
        } catch (error: any) {
            console.error('❌ Repository: Error fetching management data:', error);
            console.error('❌ Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url,
                method: error.config?.method
            });
            throw error;
        }
    }

    // Debug method - ใช้สำหรับทดสอบ
    async debug(): Promise<void> {
        console.log('🔧 Debug: Checkout Repository Configuration');
        console.log('📋 Endpoints:', {
            GET: this.URL.GET,
            CREATE: this.URL.CREATE,
            TODAY: this.URL.TODAY,
            STATS: this.URL.STATS,
            BASE_URL: this.URL.BASE_URL
        });
        
        try {
            // ทดสอบ API connection
            const testResponse = await api.get('/health-check');
            console.log('✅ API connection test:', testResponse.status);
        } catch (error) {
            console.error('❌ API connection test failed:', error);
        }
    }
}