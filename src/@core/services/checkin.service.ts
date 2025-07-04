import { CheckIn } from "@core/domain/models/check-in/list.model";
import { CheckInRepositoryPort } from "@core/interface/repositoriesport/checkin.port";
import { CheckInUseCase } from "@core/use-cases/checkin.use-case";
import { CheckInInput } from "@core/domain/models/check-in/form.model";
import { CheckInRepository } from "@core/infrastructure/api/repository/checkin.repository";

export class CheckInService {
  private useCase: CheckInUseCase;

  constructor(repositoryPort: CheckInRepositoryPort) {
    this.useCase = new CheckInUseCase(repositoryPort);
  }

  async getMany(): Promise<CheckIn[]> {
    return this.useCase.executeQuery();
  }

  async getOne(id: number): Promise<CheckIn> {
    return this.useCase.executeGetOne(id);
  }

  async create(data: CheckInInput): Promise<CheckIn> {
    return this.useCase.executeCreate(data);
  }

  async update(id: number, data: Partial<CheckInInput>): Promise<CheckIn> {
    return this.useCase.executeUpdate(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.useCase.executeDelete(id);
  }

  // Workflow methods
  async checkinBooking(bookingId: number): Promise<CheckIn> {
    return this.useCase.executeCheckinBooking(bookingId);
  }

  // Query methods
  async findByBookingId(bookingId: number): Promise<CheckIn | null> {
    return this.useCase.executeFindByBookingId(bookingId);
  }

  async findByCustomerId(customerId: number): Promise<CheckIn[]> {
    return this.useCase.executeFindByCustomerId(customerId);
  }

  async getCurrentCheckIns(): Promise<CheckIn[]> {
    return this.useCase.executeGetCurrentCheckIns();
  }

  async getStats(): Promise<{
    totalCheckIns: number;
    currentGuests: number;
    checkInsToday: number;
    expectedCheckOuts: number;
  }> {
    return this.useCase.executeGetStats();
  }
}

const repository = new CheckInRepository();
export const checkInService = new CheckInService(repository);