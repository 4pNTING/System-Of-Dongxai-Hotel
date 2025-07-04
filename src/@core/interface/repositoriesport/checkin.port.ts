// src/core/interface/repositoriesport/checkin.port.ts
import { CheckInInput } from "@core/domain/models/check-in/form.model";
import { CheckIn } from "@core/domain/models/check-in/list.model";

export interface CheckInRepositoryPort {
  getMany(): Promise<CheckIn[]>;
  getOne(id: number): Promise<CheckIn>;
  create(data: CheckInInput): Promise<CheckIn>;
  update(id: number, data: Partial<CheckInInput>): Promise<CheckIn>;
  delete(id: number): Promise<void>;

  // เพิ่ม workflow methods สำหรับ check-in process (เฉพาะ checkin)
  checkinBooking(bookingId: number): Promise<CheckIn>;
  
  // เพิ่ม query methods สำหรับการค้นหา
  findByBookingId(bookingId: number): Promise<CheckIn | null>;
  findByCustomerId(customerId: number): Promise<CheckIn[]>;
  getCurrentCheckIns(): Promise<CheckIn[]>;
  getCheckInStats(): Promise<{
    totalCheckIns: number;
    currentGuests: number;
    checkInsToday: number;
    expectedCheckOuts: number;
  }>;
}