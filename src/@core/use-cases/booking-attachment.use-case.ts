// src/@core/use-cases/booking-attachment.use-case.ts
import { BookingAttachmentRepositoryPort } from "@core/interface/repositoriesport/booking-attachment.port";
import { BookingAttachmentResponse } from "@core/services/booking-attachment.service";

export class BookingAttachmentUseCase {
  constructor(private readonly repository: BookingAttachmentRepositoryPort) {}

  async executeUpload(bookingId: number, file: File): Promise<BookingAttachmentResponse> {
    try {
      // Validate file before upload
      if (!file) {
        throw new Error('ไม่พบไฟล์ที่อัปโหลด');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('ขนาดไฟล์เกิน 10MB');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('รองรับเฉพาะไฟล์ .jpg, .png, .pdf เท่านั้น');
      }

      return await this.repository.uploadAttachment(bookingId, file);
    } catch (error) {
      throw error;
    }
  }

  async executeGetByBookingId(bookingId: number): Promise<BookingAttachmentResponse[]> {
    try {
      return await this.repository.getAttachmentsByBookingId(bookingId);
    } catch (error) {
      throw error;
    }
  }

  async executeDelete(attachmentId: number): Promise<void> {
    try {
      return await this.repository.deleteAttachment(attachmentId);
    } catch (error) {
      throw error;
    }
  }

  async executeDownload(attachmentId: number): Promise<Blob> {
    try {
      return await this.repository.downloadAttachment(attachmentId);
    } catch (error) {
      throw error;
    }
  }
}
