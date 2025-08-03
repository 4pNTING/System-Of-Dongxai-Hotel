// src/core/interface/repositoriesport/checkout.port.ts
import { CheckOutInput } from "@core/domain/models/check-out/form.model";
import { CheckOut } from "@core/domain/models/check-out/list.model";

export interface CheckOutRepositoryPort {
  getMany(): Promise<CheckOut[]>;
  getOne(id: number): Promise<CheckOut>;
  create(data: CheckOutInput): Promise<CheckOut>;
  update(id: number, data: Partial<CheckOutInput>): Promise<CheckOut>;
  delete(id: number): Promise<void>;

  // Workflow methods
  checkoutCheckIn(checkInId: number, staffId: number): Promise<CheckOut>;
  
  // Query methods
  findByCheckInId(checkInId: number): Promise<CheckOut | null>;
  getTodayCheckOuts(): Promise<CheckOut[]>;
  getCheckOutStats(): Promise<{
    totalCheckOuts: number;
    checkOutsToday: number;
    averageStayDuration: number;
    totalRevenue: number;
  }>;

  // Management methods
  getManagementData(filters?: {
    dateFrom?: string;
    dateTo?: string;
    roomId?: number;
    customerId?: number;
  }): Promise<{
    completedCheckouts: CheckOut[];
    currentlyStaying: CheckOut[];
    total: number;
  }>;
}