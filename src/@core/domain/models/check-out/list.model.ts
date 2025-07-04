// src/core/domain/models/check-out/list.model.ts
export interface CheckOut {
    CheckOutId: number;
    CheckOutDate: Date | string;
    CheckInId: number;
    RoomId: string;
    StaffId: number;
    CreatedAt?: Date | string;
    UpdatedAt?: Date | string;
    
    // Relations
    checkIn?: {
      CheckInId: number;
      CheckInDate: Date | string;
      CheckoutDate: Date | string;
      RoomId: string;
      BookingId?: number;
      CustomerId: number;
      StaffId: number;
      
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
        RoomId: string;
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
        RoomId: string;
      };
    };
    
    room?: {
      RoomId: string;
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
    
    staff?: {
      StaffId: number;
      StaffName: string;
      Gender?: string;
      Tel?: string;
      Address?: string;
      userName?: string;
      Salary?: number;
    };
}