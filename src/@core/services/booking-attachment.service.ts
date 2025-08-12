// src/@core/services/booking-attachment.service.ts
import { BookingAttachmentRepositoryPort } from '@/@core/interface/repositoriesport/booking-attachment.port';
import { BookingAttachmentUseCase } from '@/@core/use-cases/booking-attachment.use-case';
import { BookingAttachmentRepository } from '@/@core/infrastructure/api/repository/booking-attachment.repository';

export interface BookingAttachmentResponse {
  AttachmentId: number
  BookingId: number
  FilePath: string
  UploadedAt: string
}

export class BookingAttachmentService {
  private useCase: BookingAttachmentUseCase;

  constructor(repositoryPort: BookingAttachmentRepositoryPort) {
    this.useCase = new BookingAttachmentUseCase(repositoryPort);
  }

  async uploadAttachment(bookingId: number, file: File): Promise<BookingAttachmentResponse> {
    return this.useCase.executeUpload(bookingId, file);
  }

  async getAttachmentsByBookingId(bookingId: number): Promise<BookingAttachmentResponse[]> {
    return this.useCase.executeGetByBookingId(bookingId);
  }

  async deleteAttachment(attachmentId: number): Promise<void> {
    return this.useCase.executeDelete(attachmentId);
  }

  async downloadAttachment(attachmentId: number): Promise<Blob> {
    return this.useCase.executeDownload(attachmentId);
  }

  getImageUrl(filePath: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
    return `${baseUrl}/${filePath}`;
  }
}

const repository = new BookingAttachmentRepository();
export const bookingAttachmentService = new BookingAttachmentService(repository);
