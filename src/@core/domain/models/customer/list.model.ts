export interface Customer {
    CustomerId: number;
    CustomerName: string;
    CustomerGender: string;
    CustomerTel: string;
    CustomerAddress: string;
    CustomerPostcode: string;
    userName?: string;
    password?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}