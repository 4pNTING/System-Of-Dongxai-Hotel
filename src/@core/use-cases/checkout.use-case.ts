// src/core/use-cases/checkout.use-case.ts
import { CheckOut } from "@core/domain/models/check-out/list.model";
import { CheckOutRepositoryPort } from "@core/interface/repositoriesport/checkout.port";
import { CheckOutInput } from "@core/domain/models/check-out/form.model";

export class CheckOutUseCase {
  constructor(private readonly repository: CheckOutRepositoryPort) {}

  async executeQuery(): Promise<CheckOut[]> {
    try {
      return await this.repository.getMany();
    } catch (error) {
      throw error;
    }
  }

  async executeGetOne(id: number): Promise<CheckOut> {
    try {
      return await this.repository.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  async executeCreate(data: CheckOutInput): Promise<CheckOut> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async executeUpdate(id: number, data: Partial<CheckOutInput>): Promise<CheckOut> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async executeDelete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // Workflow methods
  async executeCheckoutCheckIn(checkInId: number, staffId: number): Promise<CheckOut> {
    try {
      console.log('📋 UseCase: Executing check-out for check-in ID:', checkInId);
      return await this.repository.checkoutCheckIn(checkInId, staffId);
    } catch (error) {
      console.error('❌ UseCase: Error executing check-out:', error);
      throw error;
    }
  }

  // Query methods
  async executeFindByCheckInId(checkInId: number): Promise<CheckOut | null> {
    try {
      return await this.repository.findByCheckInId(checkInId);
    } catch (error) {
      throw error;
    }
  }

  async executeGetTodayCheckOuts(): Promise<CheckOut[]> {
    try {
      return await this.repository.getTodayCheckOuts();
    } catch (error) {
      throw error;
    }
  }

  async executeGetStats(): Promise<{
    totalCheckOuts: number;
    checkOutsToday: number;
    averageStayDuration: number;
    totalRevenue: number;
  }> {
    try {
      return await this.repository.getCheckOutStats();
    } catch (error) {
      throw error;
    }
  }
}