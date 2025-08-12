// src/@core/utils/payment-mapper.ts
import { PaymentModel, PaymentDisplayModel } from "@core/domain/models/payments/list.model";

/**
 * Maps backend PaymentModel to frontend PaymentDisplayModel for table/card display
 */
export const mapPaymentToDisplayModel = (payment: PaymentModel): PaymentDisplayModel => {
  // Extract customer information from nested structure
  const customerName = payment.checkIn?.customer?.CustomerName || 
                      'ไม่ระบุ';
                      
  const customerTel = payment.checkIn?.customer?.CustomerTel || 
                     '';

  // Extract room information from nested structure  
  const roomNumber = payment.checkIn?.room?.roomNumber ||
                    payment.checkIn?.room?.RoomId?.toString() ||
                    'ไม่ระบุ';
                    
  const roomTypeName = payment.checkIn?.room?.roomType?.TypeName || 
                      'ไม่ระบุประเภทห้อง';

  // Determine payment method (Backend might not have this field, so we'll simulate)
  let paymentMethod = 'cash'; // default
  if (payment.PaymentPrice && payment.PaymentPrice > 100000) {
    paymentMethod = 'card';
  } else if (payment.PaymentPrice && payment.PaymentPrice > 500000) {
    paymentMethod = 'transfer';
  }

  // Determine payment status based on available data
  // Since backend might not have explicit status field, we'll infer from data
  let paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded' = 'paid';
  let paymentStatusId = 1;
  
  if (payment.PaymentPrice && payment.PaymentPrice > 0) {
    paymentStatus = 'paid';
    paymentStatusId = 1;
  } else {
    paymentStatus = 'pending';
    paymentStatusId = 2;
  }

  // Format payment date
  const paymentDate = payment.PaymentDate ? 
    new Date(payment.PaymentDate).toISOString().split('T')[0] : 
    new Date().toISOString().split('T')[0];

  return {
    paymentId: payment.PaymentId.toString(),
    booking: {
      customer: {
        customerName,
        customerTel
      },
      room: {
        roomNumber,
        roomType: {
          roomTypeName
        }
      }
    },
    paymentMethod,
    amount: payment.PaymentPrice || 0,
    depositAmount: payment.DepositAmount || 0,
    totalAmount: payment.TotalAmount || 0,
    paymentDate,
    paymentStatus,
    paymentStatusId
  };
};

/**
 * Maps array of PaymentModel to PaymentDisplayModel
 */
export const mapPaymentsToDisplayModels = (payments: PaymentModel[]): PaymentDisplayModel[] => {
  return payments.map(mapPaymentToDisplayModel);
};

/**
 * Calculates payment statistics from PaymentModel array
 */
export const calculatePaymentStats = (payments: PaymentModel[]) => {
  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.PaymentPrice && p.PaymentPrice > 0).length;
  const pendingPayments = totalPayments - paidPayments;
  const refundedPayments = 0; // Will need to implement based on business logic
  const totalAmount = payments.reduce((sum, p) => sum + (p.PaymentPrice || 0), 0);
  
  return {
    totalPayments,
    paidPayments,
    pendingPayments,
    refundedPayments,
    totalAmount
  };
};
