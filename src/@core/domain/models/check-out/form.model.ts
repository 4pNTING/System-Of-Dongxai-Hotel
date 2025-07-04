// src/core/domain/models/check-out/form.model.ts
export interface CheckOutInput {
    CheckOutDate: Date;
    CheckInId: number;
    RoomId: string;
    StaffId: number;
}