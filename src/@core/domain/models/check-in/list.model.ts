// src/core/domain/models/checkin/list.model.ts
export interface CheckIn {
    CheckInId: number;
    CheckInDate: Date | string;
    CheckoutDate: Date | string;
    RoomId: number;
    BookingId: number;
    CustomerId: number;
    StaffId: number;
    CreatedAt?: Date | string;
    UpdatedAt?: Date | string;
    
    // Relations
    customer?: {
      CustomerId: number;
      CustomerName: string;
      CustomerGender?: string;
      CustomerTel?: string;
      CustomerAddress?: string;
      CustomerPostcode?: string;
    };
    staff?: {
      StaffId: number;
      StaffName: string;
      Gender?: string;
      Tel?: string;
      Address?: string;
      userName?: string;
      Salary?: number;
    };
    room?: {
      RoomId: number;
      RoomPrice: number;
      TypeId?: number;
      StatusId?: number;
      roomType?: {
        TypeId: number;
        TypeName: string;
      };
      roomStatus?: {
        StatusId: number;
        StatusName: string;
      };
    };
    booking?: {
      BookingId: number;
      BookingDate: Date | string;
      CheckinDate: Date | string;
      CheckoutDate: Date | string;
      StatusId: number;
      CustomerId: number;
      StaffId: number;
      RoomId: number;
    };
    payments?: Array<{
      PaymentId: number;
      PaymentPrice: number;
      PaymentDate: Date | string;
      StaffId: number;
      CheckInId: number;
      staff?: {
        StaffId: number;
        StaffName: string;
      };
    }>;
    checkOuts?: Array<{
      CheckOutId: number;
      CheckOutDate: Date | string;
      CheckInId: number;
    }>;
  }