import { CheckIn } from "@core/domain/models/check-in/list.model";
import { CheckInRepositoryPort } from "@core/interface/repositoriesport/checkin.port";
import { CheckInInput } from "@core/domain/models/check-in/form.model";

export class CheckInUseCase {
  constructor(private readonly repository: CheckInRepositoryPort) {}

  async executeQuery(): Promise<CheckIn[]> {
    try {
      return await this.repository.getMany();
    } catch (error) {
      throw error;
    }
  }

  async executeGetOne(id: number): Promise<CheckIn> {
    try {
      return await this.repository.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  async executeCreate(data: CheckInInput): Promise<CheckIn> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async executeUpdate(id: number, data: Partial<CheckInInput>): Promise<CheckIn> {
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
  async executeCheckinBooking(bookingId: number): Promise<CheckIn> {
    try {
      console.log('📋 UseCase: Executing check-in for booking ID:', bookingId);
      return await this.repository.checkinBooking(bookingId);
    } catch (error) {
      console.error('❌ UseCase: Error executing check-in:', error);
      throw error;
    }
  }

  // Query methods
  async executeFindByBookingId(bookingId: number): Promise<CheckIn | null> {
    try {
      return await this.repository.findByBookingId(bookingId);
    } catch (error) {
      throw error;
    }
  }

  async executeFindByCustomerId(customerId: number): Promise<CheckIn[]> {
    try {
      return await this.repository.findByCustomerId(customerId);
    } catch (error) {
      throw error;
    }
  }

  async executeGetCurrentCheckIns(): Promise<CheckIn[]> {
    try {
      return await this.repository.getCurrentCheckIns();
    } catch (error) {
      throw error;
    }
  }

  async executeGetStats(): Promise<{
    totalCheckIns: number;
    currentGuests: number;
    checkInsToday: number;
    expectedCheckOuts: number;
  }> {
    try {
      return await this.repository.getCheckInStats();
    } catch (error) {
      throw error;
    }
  }
}