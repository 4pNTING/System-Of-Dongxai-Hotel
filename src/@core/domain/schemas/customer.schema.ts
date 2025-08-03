import { z } from 'zod';

export const CustomerFormSchema = z.object({
    CustomerName: z.string({
        required_error: "ຊື່ລູກຄ້າຈຳເປັນຕ້ອງກຣອກ",
        invalid_type_error: "ຊື່ລູກຄ້າຕ້ອງເປັນຂໍ້ຄວາມ"
    }).min(1, "ຊື່ລູກຄ້າຈຳເປັນຕ້ອງກຣອກ"),
    CustomerGender: z.string({
        required_error: "ເພດຈຳເປັນຕ້ອງເລືອກ",
        invalid_type_error: "ເພດຕ້ອງເປັນຂໍ້ຄວາມ"
    }),
    CustomerTel: z.union([
        z.string(),
        z.number()
    ]).optional().transform((val) => {
        if (val === undefined || val === null) return undefined;
        return String(val);
    }),
    CustomerAddress: z.string({
        required_error: "ທີ່ຢູ່ຈຳເປັນຕ້ອງກຣອກ",
        invalid_type_error: "ທີ່ຢູ່ຕ້ອງເປັນຂໍ້ຄວາມ"
    }).min(1, "ທີ່ຢູ່ຈຳເປັນຕ້ອງກຣອກ"),
    CustomerPostcode: z.union([
        z.string(),
        z.number()
    ]).optional().transform((val) => {
        if (val === undefined || val === null) return undefined;
        return String(val);
    }),
    userName: z.string({
        required_error: "ຊື່ຜູ້ໃຊ້ຈຳເປັນຕ້ອງກຣອກ",
        invalid_type_error: "ຊື່ຜູ້ໃຊ້ຕ້ອງເປັນຂໍ້ຄວາມ"
    }).min(3, "ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ"),
    password: z.string({
        required_error: "ລະຫັດຜ່ານຈຳເປັນຕ້ອງກຣອກ",
        invalid_type_error: "ລະຫັດຜ່ານຕ້ອງເປັນຂໍ້ຄວາມ"
    }).min(6, "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ")
}).partial();

export type CustomerInput = z.infer<typeof CustomerFormSchema>;