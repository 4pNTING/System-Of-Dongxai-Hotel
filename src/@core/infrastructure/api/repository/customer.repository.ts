import { api } from "@core/infrastructure/api/axios.config";
import { ApiResponse } from "@core/domain/models/common/api.model";
import { CustomerRepositoryPort } from "@core/interface/repositoriesport/customer.port";
import { CUSTOMER_QUERY } from "@core/infrastructure/queries/customer.query";
import { CUSTOMER_ENDPOINTS } from "../config/endpoints.config";
import { CustomerFormData, CustomerRegistrationData } from "@core/domain/models/customer/form.model";
import { Customer } from "@core/domain/models/customer/list.model";

export class CustomerRepository implements CustomerRepositoryPort {
    private readonly URL = CUSTOMER_ENDPOINTS;

    async getMany(): Promise<Customer[]> {
        try {
            const query = CUSTOMER_QUERY.LIST.createQuery();
            const response = await api.post<ApiResponse<Customer[]>>(this.URL.GET, query);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async getOne(id: number): Promise<Customer> {
        try {
            const query = CUSTOMER_QUERY.DETAIL.createQuery({ CustomerId: id });
            const response = await api.post<ApiResponse<Customer>>(this.URL.GET, query);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async create(data: CustomerFormData): Promise<Customer> {
        try {
            const response = await api.post<ApiResponse<Customer>>(this.URL.CREATE, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    // Frontend Registration - สำหรับลูกค้าสมัครเอง
    async register(data: CustomerRegistrationData): Promise<Customer> {
        try {
            const response = await api.post<ApiResponse<Customer>>(this.URL.REGISTER, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<CustomerFormData>): Promise<Customer> {
        try {
            const response = await api.put<ApiResponse<Customer>>(this.URL.UPDATE(id), data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await api.delete<ApiResponse<void>>(this.URL.DELETE(id));
        } catch (error) {
            throw error;
        }
    }
}