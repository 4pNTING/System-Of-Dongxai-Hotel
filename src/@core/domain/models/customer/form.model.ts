export interface CustomerFormData {
  CustomerName: string;
  CustomerGender: string;
  CustomerTel: string;
  CustomerAddress: string;
  CustomerPostcode: string;
}

// เพิ่ม CustomerInput เพื่อให้สามารถ import ได้
export interface CustomerInput {
  CustomerName?: string;
  CustomerGender?: string;
  CustomerTel?: string;
  CustomerAddress?: string;
  CustomerPostcode?: string;
}

// Registration Form Interface - สำหรับหน้า Register
export interface CustomerRegistrationForm {
  CustomerName: string;
  CustomerGender: string;
  CustomerTel: string; // เปลี่ยนเป็น string เพื่อรองรับ validation
  CustomerAddress: string;
  CustomerPostcode: string; // เปลี่ยนเป็น string เพื่อรองรับ validation
  userName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// Validation Error Interface - สำหรับเก็บ error messages
export interface CustomerRegistrationFormErrors {
  CustomerName?: string;
  CustomerGender?: string;
  CustomerTel?: string;
  CustomerAddress?: string;
  CustomerPostcode?: string;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

// Registration Data to send to API
export interface CustomerRegistrationData {
  CustomerName: string;
  CustomerGender: string;
  CustomerTel: string;
  CustomerAddress: string;
  CustomerPostcode: string;
  userName: string;
  password: string;
}