// src/core/domain/models/room-gallery/list.model.ts

export interface RoomGallery {
  GalleryId: number;
  RoomId: number;
  ImagePath: string;
  ImageName: string;
  ImageDescription: string;
  DisplayOrder: number;
  IsPrimary: boolean;
  ImageType: string;
  IsActive: boolean;
  Rating: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface RoomType {
  TypeId: number;
  TypeName: string;
  TypeDescription?: string;
  MaxOccupancy?: number;
  BasePrice?: number;
  IsActive?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface RoomStatus {
  StatusId: number;
  StatusName: string;
  StatusDescription?: string;
  IsActive?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface Room {
  RoomId: number;
  RoomPrice: number;
  TypeId: number;
  StatusId: number;
  RoomNumber?: string;
  Floor?: number;
  IsActive?: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface RoomWithGallery extends Room {
  roomType: RoomType;
  roomStatus: RoomStatus;
  galleries: RoomGallery[];
  primaryImage?: RoomGallery;
  averageRating?: number;
  reviewCount?: number;
  totalImages?: number;
  isAvailable?: boolean;
}

export interface RoomDisplayData {
  RoomId: number;
  RoomPrice: number;
  TypeId: number;
  StatusId: number;
  roomType: RoomType;
  roomStatus: RoomStatus;
  galleries?: RoomGallery[];
  primaryImage?: RoomGallery;
  averageRating?: number;
  reviewCount?: number;
}

export interface RoomGalleryStats {
  totalGalleries: number;
  totalRooms: number;
  averageImagesPerRoom: number;
  roomsWithoutImages: number;
  topRatedRooms: Array<{
    RoomId: number;
    TypeName: string;
    AverageRating: number;
    ImageCount: number;
  }>;
}

export interface RoomSearchFilters {
  roomTypeId?: number;
  priceMin?: number;
  priceMax?: number;
  statusId?: number;
  hasGallery?: boolean;
  rating?: number;
  checkinDate?: string;
  checkoutDate?: string;
  guests?: number;
}

export interface RoomAvailability {
  RoomId: number;
  IsAvailable: boolean;
  AvailableFrom?: string;
  AvailableUntil?: string;
  BookedDates?: Array<{
    CheckinDate: string;
    CheckoutDate: string;
  }>;
}