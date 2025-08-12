// src/@core/interface/repositoriesport/booking-attachment.port.ts
import { BookingAttachmentResponse } from "@core/services/booking-attachment.service";

export interface BookingAttachmentRepositoryPort {
  uploadAttachment(bookingId: number, file: File): Promise<BookingAttachmentResponse>;
  getAttachmentsByBookingId(bookingId: number): Promise<BookingAttachmentResponse[]>;
  deleteAttachment(attachmentId: number): Promise<void>;
  downloadAttachment(attachmentId: number): Promise<Blob>;
}
