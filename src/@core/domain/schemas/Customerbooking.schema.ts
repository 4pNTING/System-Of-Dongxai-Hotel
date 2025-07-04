import { z } from 'zod';

export const CustomerBookingSchema = z.object({
  RoomId: z.number().int().positive({ message: 'กรุณาเลือกห้องพักที่ถูกต้อง' }),
  CheckinDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'วันที่เช็คอินต้องอยู่ในรูปแบบ YYYY-MM-DD' }),
  CheckoutDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'วันที่เช็คเอาต์ต้องอยู่ในรูปแบบ YYYY-MM-DD' })
}).refine((data) => {
  const checkinDate = new Date(data.CheckinDate);
  const checkoutDate = new Date(data.CheckoutDate);
  return checkoutDate > checkinDate;
}, {
  message: 'วันที่เช็คเอาต์ต้องหลังจากวันที่เช็คอิน',
  path: ['CheckoutDate']
});