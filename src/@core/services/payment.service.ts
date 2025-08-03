// src/@core/services/payment.service.ts
import { PaymentModel, PaymentQueryParams } from "@core/domain/models/payments/list.model";
import { PaymentRepository, PaymentRepositoryPort } from "@core/infrastructure/api/repository/payment.repository";

export interface PaymentServicePort {
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

export class PaymentService implements PaymentServicePort {
  constructor(private repositoryPort: PaymentRepositoryPort) {}

  async getMany(params?: PaymentQueryParams): Promise<PaymentModel[]> {
    try {
      console.log('PaymentService: Fetching payments with params:', params);
      return await this.repositoryPort.getMany(params);
    } catch (error) {
      console.error('PaymentService: Error fetching payments:', error);
      throw error;
    }
  }

  async getOne(id: number): Promise<PaymentModel> {
    try {
      console.log('PaymentService: Fetching payment details for ID:', id);
      return await this.repositoryPort.getOne(id);
    } catch (error) {
      console.error('PaymentService: Error fetching payment details:', error);
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
      console.log('PaymentService: Fetching payment statistics');
      return await this.repositoryPort.getStats();
    } catch (error) {
      console.error('PaymentService: Error fetching payment statistics:', error);
      throw error;
    }
  }
}

// Create singleton instance
const repository = new PaymentRepository();
export const paymentService = new PaymentService(repository);
