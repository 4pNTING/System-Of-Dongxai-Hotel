// src/core/services/checkout.service.ts
import { CheckOut } from "@core/domain/models/check-out/list.model";
import { CheckOutRepositoryPort } from "@core/interface/repositoriesport/checkout.port";
import { CheckOutUseCase } from "@core/use-cases/checkout.use-case";
import { CheckOutInput } from "@core/domain/models/check-out/form.model";
import { CheckOutRepository } from "@core/infrastructure/api/repository/checkout.repository";

export class CheckOutService {
  private useCase: CheckOutUseCase;

  constructor(repositoryPort: CheckOutRepositoryPort) {
    this.useCase = new CheckOutUseCase(repositoryPort);
  }

  async getMany(): Promise<CheckOut[]> {
    return this.useCase.executeQuery();
  }

  async getOne(id: number): Promise<CheckOut> {
    return this.useCase.executeGetOne(id);
  }

  async create(data: CheckOutInput): Promise<CheckOut> {
    return this.useCase.executeCreate(data);
  }

  async update(id: number, data: Partial<CheckOutInput>): Promise<CheckOut> {
    return this.useCase.executeUpdate(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.useCase.executeDelete(id);
  }

  // Workflow methods
  async checkoutCheckIn(checkInId: number, staffId: number): Promise<CheckOut> {
    return this.useCase.executeCheckoutCheckIn(checkInId, staffId);
  }

  // Query methods
  async findByCheckInId(checkInId: number): Promise<CheckOut | null> {
    return this.useCase.executeFindByCheckInId(checkInId);
  }

  async getTodayCheckOuts(): Promise<CheckOut[]> {
    return this.useCase.executeGetTodayCheckOuts();
  }

  async getStats(): Promise<{
    totalCheckOuts: number;
    checkOutsToday: number;
    averageStayDuration: number;
    totalRevenue: number;
  }> {
    return this.useCase.executeGetStats();
  }
}

const repository = new CheckOutRepository();
export const checkOutService = new CheckOutService(repository);