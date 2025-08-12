// src/core/infrastructure/queries/booking.query.ts
import { QueryOptions } from "@core/domain/models/common/api.model";

export const BOOKING_QUERY = {
  LIST: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "BookingId", 
        "BookingDate", 
        "CheckinDate", 
        "CheckoutDate", 
        "StatusId",
        "CustomerId",
        "StaffId",
        "RoomId",
        "bookingStatus.StatusId",
        "bookingStatus.StatusName",
        "bookingStatus.StatusDescription",
        "customer.CustomerId",
        "customer.CustomerName",
        "staff.StaffId",
        "staff.StaffName",
        "room.RoomId",
        "room.RoomPrice",
        "CreatedAt",
        "UpdatedAt"
      ],
      relations: ["bookingStatus", "customer", "staff", "room", "attachments"],
      filter: filter,
      getType: "many"
    })
  },

  DETAIL: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      select: [
        "BookingId", 
        "BookingDate", 
        "CheckinDate", 
        "CheckoutDate", 
        "StatusId",
        "CustomerId",
        "StaffId",
        "RoomId",
        "bookingStatus.StatusId",
        "bookingStatus.StatusName",
        "bookingStatus.StatusDescription",
        "customer.CustomerId",
        "customer.CustomerName",
        "customer.Tel",
        "customer.Email",
        "staff.StaffId",
        "staff.StaffName",
        "room.RoomId",
        "room.RoomPrice",
        "roomType.TypeName",
        "CreatedAt",
        "UpdatedAt"
      ],
      relations: ["bookingStatus", "customer", "staff", "room", "room.roomType", "attachments"],
      filter: filter,
      getType: "one"
    })
  },

  BY_STATUS: {
    createQuery: (statusId: number): QueryOptions => ({
      select: [
        "BookingId", 
        "BookingDate", 
        "CheckinDate", 
        "CheckoutDate",
        "customer.CustomerName",
        "room.RoomId",
        "bookingStatus.StatusName"
      ],
      relations: ["bookingStatus", "customer", "room"],
      filter: { StatusId: statusId },
      getType: "many"
    })
  },

  BY_CUSTOMER: {
    createQuery: (customerId: number): QueryOptions => ({
      select: [
        "BookingId", 
        "BookingDate", 
        "CheckinDate", 
        "CheckoutDate",
        "room.RoomId",
        "bookingStatus.StatusName"
      ],
      relations: ["bookingStatus", "room"],
      filter: { CustomerId: customerId },
      getType: "many"
    })
  },

  BY_DATE_RANGE: {
    createQuery: (startDate: Date, endDate: Date): QueryOptions => ({
      select: [
        "BookingId", 
        "BookingDate", 
        "CheckinDate", 
        "CheckoutDate",
        "customer.CustomerName",
        "room.RoomId",
        "bookingStatus.StatusName"
      ],
      relations: ["bookingStatus", "customer", "room"],
      filter: {
        BookingDate: {
          $gte: startDate,
          $lte: endDate
        }
      },
      getType: "many"
    })
  }
} as const;