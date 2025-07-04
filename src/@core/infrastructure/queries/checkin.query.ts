import { QueryOptions } from "@core/domain/models/common/api.model";

export const CHECKIN_QUERY = {
  LIST: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "CheckInId",
        "CheckInDate", 
        "CheckoutDate",
        "RoomId",
        "BookingId",
        "CustomerId",
        "StaffId",
        "customer.CustomerId",
        "customer.CustomerName",
        "customer.CustomerTel",
        "staff.StaffId",
        "staff.StaffName",
        "room.RoomId",
        "room.RoomPrice",
        "room.roomType.TypeName",
        "room.roomStatus.StatusName",
        "booking.BookingId",
        "booking.StatusId",
        "CreatedAt",
        "UpdatedAt"
      ],
      relations: [
        "customer", 
        "staff", 
        "room", 
        "room.roomType", 
        "room.roomStatus", 
        "booking",
        "payments",
        "checkOuts"
      ],
      filter: filter,
      getType: "many"
    })
  },

  DETAIL: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "CheckInId",
        "CheckInDate", 
        "CheckoutDate",
        "RoomId",
        "BookingId",
        "CustomerId",
        "StaffId",
        "customer.CustomerId",
        "customer.CustomerName",
        "customer.CustomerTel",
        "customer.CustomerAddress",
        "staff.StaffId",
        "staff.StaffName",
        "room.RoomId",
        "room.RoomPrice",
        "room.roomType.TypeName",
        "room.roomStatus.StatusName",
        "booking.BookingId",
        "booking.StatusId",
        "payments.PaymentId",
        "payments.PaymentPrice",
        "payments.PaymentDate",
        "checkOuts.CheckOutId",
        "checkOuts.CheckOutDate",
        "CreatedAt",
        "UpdatedAt"
      ],
      relations: [
        "customer", 
        "staff", 
        "room", 
        "room.roomType", 
        "room.roomStatus", 
        "booking",
        "payments",
        "payments.staff",
        "checkOuts"
      ],
      filter: filter,
      getType: "one"
    })
  },

  BY_STATUS: {
    createQuery: (status: 'current' | 'completed'): QueryOptions => ({
      select: [
        "CheckInId",
        "CheckInDate", 
        "CheckoutDate",
        "customer.CustomerName",
        "room.RoomId",
        "room.roomType.TypeName"
      ],
      relations: ["customer", "room", "room.roomType", "checkOuts"],
      filter: status === 'current' ? { checkOuts: null } : { checkOuts: { $ne: null } },
      getType: "many"
    })
  }
} as const;