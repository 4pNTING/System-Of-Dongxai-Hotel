// src/@core/domain/models/payments/list.model.ts

export interface PaymentModel {
  PaymentId: number
  PaymentPrice: number
  PaymentDate: string | Date
  StaffId: number
  CheckInId?: number
  BookingId?: number
  PaymentType?: string
  DepositAmount?: number
  TotalAmount?: number
  createdAt?: string | Date
  updatedAt?: string | Date
  
  // Related entities
  checkIn?: {
    CheckInId: number
    CheckInDate: string | Date
    CheckoutDate?: string | Date
    RoomId: number
    BookingId: number
    CustomerId: number
    StaffId: number
    
    room?: {
      RoomId: number
      TypeId: number
      StatusId: number
      RoomPrice: number
      roomNumber?: string
      roomType?: {
        TypeId: number
        TypeName: string
      }
      roomStatus?: {
        StatusId: number
        StatusName: string
      }
    }
    
    customer?: {
      CustomerId: number
      CustomerName: string
      CustomerGender: string
      CustomerTel: string
      CustomerAddress: string
      CustomerPostcode: string
    }
    
    booking?: {
      BookingId: number
      CheckinDate: string | Date
      CheckoutDate: string | Date
      TotalPrice: number
      StatusId: number
      CustomerId: number
      RoomId: number
    }
  }
  
  staff?: {
    StaffId: number
    StaffName: string
    StaffEmail: string
    StaffTel: string
  }
}

// Payment status mapping for frontend display
export interface PaymentDisplayModel {
  paymentId: string
  booking: {
    customer: {
      customerName: string
      customerTel: string
    }
    room: {
      roomNumber: string
      roomType: {
        roomTypeName: string
      }
    }
  }
  paymentMethod: string
  amount: number
  depositAmount?: number
  totalAmount?: number
  paymentDate: string
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentStatusId: number
}

// Query parameters for payment API
export interface PaymentQueryParams {
  page?: number
  limit?: number
  CheckInId?: number
  BookingId?: number
  CustomerId?: number
  PaymentType?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}
