import { Customer } from "@core/domain/models/customer/list.model";
import { CustomerRepositoryPort } from "@core/interface/repositoriesport/customer.port";
import { CustomerUseCase } from "@core/use-cases/customer.use-case";
import { CustomerFormData, CustomerRegistrationData } from "@core/domain/models/customer/form.model";
import { CustomerRepository } from "@core/infrastructure/api/repository/customer.repository";

export class CustomerService {
    private useCase: CustomerUseCase;

    constructor(repositoryPort: CustomerRepositoryPort) {
        this.useCase = new CustomerUseCase(repositoryPort);
    }

    async getMany(): Promise<Customer[]> {
        return this.useCase.executeQuery();
    }

    async getOne(id: number): Promise<Customer> {
        return this.useCase.executeGetOne(id);
    }

    async create(data: CustomerFormData): Promise<Customer> {
        return this.useCase.executeCreate(data);
    }

    // Frontend Registration - สำหรับลูกค้าสมัครเอง
    async register(data: CustomerRegistrationData): Promise<Customer> {
        return this.useCase.executeRegister(data);
    }

    async update(id: number, data: Partial<CustomerFormData>): Promise<Customer> {
        return this.useCase.executeUpdate(id, data);
    }

    async delete(id: number): Promise<void> {
        return this.useCase.executeDelete(id);
    }
}

const repository = new CustomerRepository();
export const customerService = new CustomerService(repository);