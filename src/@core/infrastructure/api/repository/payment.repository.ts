// src/@core/infrastructure/api/repository/payment.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { PaymentModel, PaymentQueryParams } from "@core/domain/models/payments/list.model";

export interface PaymentRepositoryPort {
  getMany(params?: PaymentQueryParams): Promise<PaymentModel[]>;
  getOne(id: number): Promise<PaymentModel>;
  getStats(): Promise<{
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    refundedPayments: number;
    totalAmount: number;
  }>;
}

export class PaymentRepository implements PaymentRepositoryPort {
  private readonly URL = {
    GET: '/payments',
    GET_ONE: '/payments',
    STATS: '/payments/stats'
  };

  async getMany(params?: PaymentQueryParams): Promise<PaymentModel[]> {
    try {
      console.log('Fetching payments with params:', params);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.CheckInId) queryParams.append('CheckInId', params.CheckInId.toString());
      if (params?.BookingId) queryParams.append('BookingId', params.BookingId.toString());
      if (params?.CustomerId) queryParams.append('CustomerId', params.CustomerId.toString());
      if (params?.PaymentType) queryParams.append('PaymentType', params.PaymentType);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.minAmount) queryParams.append('minAmount', params.minAmount.toString());
      if (params?.maxAmount) queryParams.append('maxAmount', params.maxAmount.toString());

      const url = queryParams.toString() ? `${this.URL.GET}?${queryParams}` : this.URL.GET;
      const response = await api.get<ApiResponse<PaymentModel[]>>(url);
      
      console.log('Payment API response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  async getOne(id: number): Promise<PaymentModel> {
    try {
      console.log('Fetching payment details for ID:', id);
      
      const response = await api.get<ApiResponse<PaymentModel>>(`${this.URL.GET_ONE}/${id}`);
      console.log('Payment detail response:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  }

  async getStats(): Promise<{
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    refundedPayments: number;
    totalAmount: number;
  }> {
    try {
      console.log('Fetching payment statistics');
      
      // Get all payments to calculate stats (alternatively, backend could provide stats endpoint)
      const payments = await this.getMany();
      
      const totalPayments = payments.length;
      const paidPayments = payments.filter(p => p.PaymentPrice && p.PaymentPrice > 0).length;
      const pendingPayments = 0; // Adjust logic based on your payment status field
      const refundedPayments = 0; // Adjust logic based on your payment status field
      const totalAmount = payments.reduce((sum, p) => sum + (p.PaymentPrice || 0), 0);
      
      const stats = {
        totalPayments,
        paidPayments,
        pendingPayments,
        refundedPayments,
        totalAmount
      };
      
      console.log('Payment statistics:', stats);
      return stats;
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw error;
    }
  }
}
