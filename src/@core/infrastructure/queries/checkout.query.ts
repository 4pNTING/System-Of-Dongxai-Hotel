// src/core/infrastructure/queries/checkout.query.ts
import { QueryOptions } from "@core/domain/models/common/api.model";

export const CHECKOUT_QUERY = {
  LIST: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      relations: [
        "checkIn", 
        "checkIn.customer", 
        "checkIn.room", 
        "checkIn.room.roomType", 
        "room", 
        "room.roomType", 
        "staff"
      ],
      filter: filter,
      getType: "many"
    })
  },

  DETAIL: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      relations: [
        "checkIn", 
        "checkIn.customer", 
        "checkIn.staff", 
        "checkIn.room", 
        "checkIn.room.roomType", 
        "checkIn.booking",
        "room", 
        "room.roomType", 
        "staff"
      ],
      filter: filter,
      getType: "one"
    })
  },

  TODAY: {
    createQuery: (): QueryOptions => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return {
        relations: ["checkIn", "checkIn.customer", "room", "room.roomType"],
        filter: {
          CheckOutDate: {
            $gte: today.toISOString(),
            $lt: tomorrow.toISOString()
          }
        },
        getType: "many"
      };
    }
  }
} as const;