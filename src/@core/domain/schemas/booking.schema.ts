// src/core/domain/schemas/booking.schema.ts
import { z } from 'zod';

export const BookingFormSchema = z.object({
  BookingDate: z.coerce.date({
    required_error: "ກະລຸນາລະບຸວັນທີຈອງ",
    invalid_type_error: "ວັນທີຈອງບໍ່ຖືກຕ້ອງ",
  }),
  
  RoomId: z.number({
    required_error: "ກະລຸນາເລືອກຫ້ອງພັກ",
    invalid_type_error: "ຫ້ອງພັກບໍ່ຖືກຕ້ອງ",
  }).min(1, "ກະລຸນາເລືອກຫ້ອງພັກ"),
  
  CheckinDate: z.coerce.date({
    required_error: "ກະລຸນາລະບຸວັນທີເຂົ້າພັກ",
    invalid_type_error: "ວັນທີເຂົ້າພັກບໍ່ຖືກຕ້ອງ",
  }),
  
  CheckoutDate: z.coerce.date({
    required_error: "ກະລຸນາລະບຸວັນທີອອກຈາກຫ້ອງພັກ",
    invalid_type_error: "ວັນທີອອກຈາກຫ້ອງພັກບໍ່ຖືກຕ້ອງ",
  }),
  
  CustomerId: z.number({
    required_error: "ກະລຸນາເລືອກລູກຄ້າ",
    invalid_type_error: "ລູກຄ້າບໍ່ຖືກຕ້ອງ",
  }).min(1, "ກະລຸນາເລືອກລູກຄ້າ"),
  
  StaffId: z.number({
    required_error: "ກະລຸນາເລືອກພະນັກງານ",
    invalid_type_error: "ພະນັກງານບໍ່ຖືກຕ້ອງ",
  }).min(1, "ກະລຸນາເລືອກພະນັກງານ"),
  
  StatusId: z.number({
    required_error: "ກະລຸນາເລືອກສະຖານະ",
    invalid_type_error: "ສະຖານະບໍ່ຖືກຕ້ອງ",
  }).min(1, "ກະລຸນາເລືອກສະຖານະ"),

  // 💰 เงินมัดจำ (ทางเลือก)
  deposit: z.number({
    invalid_type_error: "ມັດຈໍາຕ້ອງເປັນຕົວເລກ",
  }).min(0, "ມັດຈໍາຕ້ອງເປັນຈໍານວນບວກ").optional(),
}).refine(data => {
  // ตรวจสอบว่าวันที่ CheckinDate ต้องมาก่อนหรือเท่ากับ CheckoutDate
  return data.CheckinDate <= data.CheckoutDate;
}, {
  message: "ວັນທີເຂົ້າພັກຕ້ອງເປັນວັນທີກ່ອນຫຼືເທົ່າກັບວັນທີອອກຈາກຫ້ອງພັກ",
  path: ["CheckinDate"]
});