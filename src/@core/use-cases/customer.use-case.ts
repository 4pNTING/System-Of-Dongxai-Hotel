// src/app/application/use-cases/customer-use-case.ts
import { Customer } from "@core/domain/models/customer/list.model";
import { CustomerRepositoryPort } from "../interface/repositoriesport/customer.port";
import { CustomerFormData, CustomerRegistrationData } from "@core/domain/models/customer/form.model";

export class CustomerUseCase {
    constructor(private readonly repository: CustomerRepositoryPort) { }

    async executeQuery(): Promise<Customer[]> {
        try {
            return await this.repository.getMany();
        } catch (error) {
            throw error;
        }
    }

    async executeGetOne(id: number): Promise<Customer> {
        try {
            return await this.repository.getOne(id);
        } catch (error) {
            throw error;
        }
    }

    async executeCreate(data: CustomerFormData): Promise<Customer> {
        try {
            return await this.repository.create(data);
        } catch (error) {
            throw error;
        }
    }

    // Frontend Registration - สำหรับลูกค้าสมัครเอง
    async executeRegister(data: CustomerRegistrationData): Promise<Customer> {
        try {
            return await this.repository.register(data);
        } catch (error) {
            throw error;
        }
    }

    async executeUpdate(id: number, data: Partial<CustomerFormData>): Promise<Customer> {
        try {
            return await this.repository.update(id, data);
        } catch (error) {
            throw error;
        }
    }

    async executeDelete(id: number): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            throw error;
        }
    }
}