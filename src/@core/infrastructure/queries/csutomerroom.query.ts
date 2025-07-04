import { QueryOptions } from "@core/domain/models/common/api.model";

export const CUSTOMER_BOOKING_QUERY = {
  ROOMS_FOR_BOOKING: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      relations: ["roomType", "roomStatus", "galleries"],
      filter: { StatusId: 1, ...filter },
      getType: "many"
    })
  },

  ROOM_DETAIL: {
    createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
      relations: ["roomType", "roomStatus", "galleries"],
      filter: filter,
      getType: "one"
    })
  },

  SEARCH_ROOMS: {
    createQuery: (searchParams: {
      checkinDate?: string;
      checkoutDate?: string;
      priceMax?: number;
    }): QueryOptions => {
      const filter: Record<string, any> = { StatusId: 1 };
      
      if (searchParams.priceMax) {
        filter.RoomPrice = { $lte: searchParams.priceMax };
      }

      return {
        relations: ["roomType", "roomStatus", "galleries"],
        filter: filter,
        getType: "many"
      };
    }
  }
} as const;