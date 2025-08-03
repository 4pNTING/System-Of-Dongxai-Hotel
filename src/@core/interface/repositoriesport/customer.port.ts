import { CustomerFormData, CustomerRegistrationData } from "@core/domain/models/customer/form.model";
import { Customer } from "@core/domain/models/customer/list.model";

export interface CustomerRepositoryPort {
    getMany(): Promise<Customer[]>;
    getOne(id: number): Promise<Customer>;
    create(data: CustomerFormData): Promise<Customer>;
    register(data: CustomerRegistrationData): Promise<Customer>; 
    update(id: number, data: Partial<CustomerFormData>): Promise<Customer>;
    delete(id: number): Promise<void>;
}