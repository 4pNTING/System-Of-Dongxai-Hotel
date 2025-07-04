// src/core/domain/models/room-gallery/form.model.ts

export interface RoomGalleryInput {
    RoomId: number;
    ImagePath: string;
    ImageName: string;
    ImageDescription: string;
    DisplayOrder?: number;
    IsPrimary?: boolean;
    ImageType?: string;
    IsActive?: boolean;
    Rating?: string;
  }
  
  export interface RoomGalleryCreateInput {
    RoomId: number;
    ImagePath: string;
    ImageName: string;
    ImageDescription: string;
    DisplayOrder?: number;
    IsPrimary?: boolean;
    ImageType?: string;
  }
  
  export interface RoomGalleryUpdateInput {
    ImagePath?: string;
    ImageName?: string;
    ImageDescription?: string;
    DisplayOrder?: number;
    IsPrimary?: boolean;
    ImageType?: string;
    IsActive?: boolean;
    Rating?: string;
  }
  
  export interface RoomGalleryBulkUpdateInput {
    galleries: Array<{
      GalleryId: number;
      DisplayOrder: number;
    }>;
  }
  
  export interface RoomGallerySearchParams {
    roomId?: number;
    isPrimary?: boolean;
    isActive?: boolean;
    imageType?: string;
    orderBy?: 'DisplayOrder' | 'CreatedAt' | 'Rating';
    orderDirection?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }
  
  export interface ImageUploadInput {
    file: File;
    roomId: number;
    description?: string;
    isPrimary?: boolean;
    displayOrder?: number;
  }
  
  export interface ImageUploadResponse {
    success: boolean;
    imagePath: string;
    galleryId: number;
    message?: string;
  }