// src/app/infrastructure/api/axios.config.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { useLoadingStore } from '@/@core/infrastructure/store/useLoading.store';
import { useErrorStore } from '@/@core/infrastructure/store/useError.store';

// API configuration
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
const TIMEOUT = 30000;

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

});
console.log("API URL being used:", API_URL);
// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // ตั้งค่า loading state เป็น false เมื่อได้รับการตอบกลับ
    useLoadingStore.getState().setLoading(false);
    
    // ถ้า response มีฟิลด์ data เป็น object ให้ส่งค่านั้นกลับไป
    if (response.data && typeof response.data === 'object') {
      return response;
    }
    
    return response;
  },
  async (error: AxiosError) => {
    // ตั้งค่า loading state เป็น false เมื่อเกิดข้อผิดพลาด
    useLoadingStore.getState().setLoading(false);
    
    // แสดงข้อความข้อผิดพลาด (ถ้ามี)
    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      useErrorStore.getState().setError(error.response.data.message as string);
    } else if (error.message) {
      useErrorStore.getState().setError(error.message);
    }
    
    const originalRequest: any = error.config;
    
    // ถ้าเกิด 401 Unauthorized และไม่ใช่การพยายาม refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;
      
      try {
        // ใช้ NextAuth session แทน Zustand
        const session = await getSession();
        
        if (!session?.user?.refreshToken) {
          // ถ้าไม่มี refresh token ให้ logout
          signOut({ callbackUrl: '/login' });
          return Promise.reject(error);
        }
        
        // ทำการ refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken: session.user.refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data && response.data.data) {
          const { accessToken } = response.data.data;
          
          // ตั้งค่า token ใหม่ในคำขอเดิม
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          
          // ส่งคำขอเดิมอีกครั้ง
          return api(originalRequest);
        }
      } catch (refreshError) {
        // ถ้า refresh token ไม่สำเร็จ ให้ logout
        signOut({ callbackUrl: '/login' });
        return Promise.reject(refreshError);
      }
    }
    
    // ถ้าเป็นข้อผิดพลาดอื่นๆ
    return Promise.reject(error);
  }
);

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    // ตั้งค่า loading state เป็น true เมื่อส่งคำขอ
    useLoadingStore.getState().setLoading(true);
    
    // ดึง token จาก NextAuth session
    const session = await getSession();
    const accessToken = session?.user?.accessToken;
    
    // ถ้ามี token ให้เพิ่มในส่วนหัวของคำขอ
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    // ตั้งค่า loading state เป็น false เมื่อเกิดข้อผิดพลาด
    useLoadingStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);

export { api };