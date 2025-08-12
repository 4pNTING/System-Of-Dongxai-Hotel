// src/@core/infrastructure/api/repository/booking-attachment.repository.ts
import { api } from "@core/infrastructure/api/axios.config";
import { BookingAttachmentRepositoryPort } from "@core/interface/repositoriesport/booking-attachment.port";
import { BookingAttachmentResponse } from "@core/services/booking-attachment.service";
import { BOOKING_ATTACHMENT_ENDPOINTS } from "../config/endpoints.config";

export class BookingAttachmentRepository implements BookingAttachmentRepositoryPort {
  private readonly URL = BOOKING_ATTACHMENT_ENDPOINTS;

  async uploadAttachment(bookingId: number, file: File): Promise<BookingAttachmentResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('🚀 Repository: Uploading file:', {
        bookingId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const response = await api.post<BookingAttachmentResponse>(
        this.URL.UPLOAD(bookingId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ Repository: Upload successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Repository: Upload failed:', error);
      throw new Error(error.response?.data?.message || 'การอัปโหลดไฟล์ล้มเหลว');
    }
  }

  async getAttachmentsByBookingId(bookingId: number): Promise<BookingAttachmentResponse[]> {
    try {
      const response = await api.get<BookingAttachmentResponse[]>(this.URL.BY_BOOKING(bookingId));
      return response.data;
    } catch (error: any) {
      console.error('❌ Repository: Get attachments failed:', error);
      throw new Error(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลไฟล์แนบได้');
    }
  }

  async deleteAttachment(attachmentId: number): Promise<void> {
    try {
      await api.delete(this.URL.DELETE(attachmentId));
      console.log('✅ Repository: Delete successful');
    } catch (error: any) {
      console.error('❌ Repository: Delete failed:', error);
      throw new Error(error.response?.data?.message || 'การลบไฟล์ล้มเหลว');
    }
  }

  async downloadAttachment(attachmentId: number): Promise<Blob> {
    try {
      const response = await api.get(this.URL.DOWNLOAD(attachmentId), {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Repository: Download failed:', error);
      throw new Error(error.response?.data?.message || 'การดาวน์โหลดไฟล์ล้มเหลว');
    }
  }
}
