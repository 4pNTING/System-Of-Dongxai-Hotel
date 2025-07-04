// src/views/apps/components/customer/my-bookings/SelectionCard.tsx
'use client';

import React, { useState } from 'react';
import { RoomWithGallery } from '@/@core/domain/models/room-gallery/list.model';

interface RoomSelectionCardsProps {
  rooms: RoomWithGallery[];
  onBookRoom: (roomId: number, bookingData: any) => void;
  onViewDetails: (roomId: number) => void;
  searchFilters: {
    checkinDate: string;
    checkoutDate: string;
    priceMax: string;
  };
}

interface RoomCardProps {
  room: RoomWithGallery;
  onBookRoom: (roomId: number, bookingData: any) => void;
  onViewDetails: (roomId: number) => void;
  defaultBookingDates: {
    checkinDate: string;
    checkoutDate: string;
  };
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  onBookRoom, 
  onViewDetails,
  defaultBookingDates
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDates, setBookingDates] = useState(defaultBookingDates);

  // Get active galleries sorted by display order
  const activeGalleries = room.galleries
    ?.filter(img => img.IsActive)
    ?.sort((a, b) => a.DisplayOrder - b.DisplayOrder) || [];

  const currentImage = activeGalleries[currentImageIndex];
  const displayImage = currentImage?.ImagePath || 
    room.primaryImage?.ImagePath || 
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop';

  const description = currentImage?.ImageDescription || 
    room.primaryImage?.ImageDescription || 
    'ຫ້ອງພັກສະດວກສະບາຍ ມີສິ່ງອຳນວຍຄວາມສະດວກຄົບຄັນ';

  // Star Rating Component
  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i} style={{ color: '#d4851c' }}>★</span>);
      } else if (i - 0.5 <= roundedRating) {
        stars.push(<span key={i} style={{ color: '#d4851c' }}>☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }
    return <div className="flex text-sm">{stars}</div>;
  };

  // Image Navigation
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeGalleries.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % activeGalleries.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeGalleries.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + activeGalleries.length) % activeGalleries.length);
    }
  };

  // Booking Logic
  const handleBookRoom = () => {
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async () => {
    if (!bookingDates.checkinDate || !bookingDates.checkoutDate) {
      alert('ກະລຸນາເລືອກວັນທີ່ເຊັກອິນ ແລະ ເຊັກເອົາ');
      return;
    }

    setIsBooking(true);
    
    try {
      const bookingData = {
        CheckinDate: bookingDates.checkinDate,
        CheckoutDate: bookingDates.checkoutDate
      };

      await onBookRoom(room.RoomId, bookingData);
      setShowBookingForm(false);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleViewDetails = () => {
    onViewDetails(room.RoomId);
  };

  console.log('room data:', room);

  return (
    <>
      <div 
        className="bg-white rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
        style={{ 
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(212, 133, 28, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(212, 133, 28, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(212, 133, 28, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(212, 133, 28, 0.1)';
        }}
      >
        {/* Room Image with Gallery Navigation */}
        <div 
          className="h-52 bg-cover bg-center relative cursor-pointer group"
          style={{ backgroundImage: `url(${displayImage})` }}
          onClick={handleViewDetails}
        >
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

          {/* Image Navigation Arrows */}
          {activeGalleries.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 text-xl font-bold"
                style={{ 
                  backgroundColor: 'rgba(212, 133, 28, 0.8)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d4851c';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 133, 28, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 text-xl font-bold"
                style={{ 
                  backgroundColor: 'rgba(212, 133, 28, 0.8)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d4851c';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 133, 28, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Price Tag */}
          <div 
            className="absolute bottom-4 right-4 backdrop-blur-md rounded-lg px-4 py-3 shadow-lg"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(212, 133, 28, 0.2)'
            }}
          >
            <div className="text-xl font-bold" style={{ color: '#d4851c' }}>
              ₭{room.RoomPrice.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">/ ຄືນ</div>
          </div>

          {/* Gallery Count Badge */}
          {activeGalleries.length > 1 && (
            <div 
              className="absolute top-4 left-4 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-md"
              style={{ backgroundColor: 'rgba(212, 133, 28, 0.9)' }}
            >
              📷 {activeGalleries.length} ຮູບ ({currentImageIndex + 1}/{activeGalleries.length})
            </div>
          )}

          {/* Image Dots Indicator */}
          {activeGalleries.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {activeGalleries.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className="w-3 h-3 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: currentImageIndex === index ? '#d4851c' : 'rgba(255, 255, 255, 0.5)',
                    transform: currentImageIndex === index ? 'scale(1.2)' : 'scale(1)'
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Luxury Badge */}
          <div 
            className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md"
            style={{ backgroundColor: 'rgba(212, 133, 28, 0.9)' }}
          >
            ✨ LUXURY
          </div>
        </div>
        
        <div className="p-6">
          {/* Room Info */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-3">
              <h3 
                className="text-xl font-bold cursor-pointer hover:underline transition-all duration-200" 
                style={{ color: '#2c3e50' }}
                onClick={handleViewDetails}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#d4851c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#2c3e50';
                }}
              >
                {room.roomType.TypeName}
              </h3>
              
              {/* Rating */}
              {room.averageRating && room.averageRating > 0 && room.reviewCount && room.reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={room.averageRating || 0} />
                  <span className="text-sm" style={{ color: '#d4851c', fontWeight: '500' }}>
                    ({room.reviewCount || 0} ລີວິວ)
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>

            {/* Room Features */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Free WiFi', 'Air Con', 'Mini Bar', 'Room Service'].map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: 'rgba(212, 133, 28, 0.1)',
                    color: '#d4851c',
                    border: '1px solid rgba(212, 133, 28, 0.2)'
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleViewDetails}
              className="flex-1 px-4 py-3 border-2 rounded-lg transition-all duration-200 text-sm font-medium transform hover:scale-105"
              style={{ 
                borderColor: '#d4851c',
                color: '#d4851c'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d4851c';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#d4851c';
              }}
            >
              ລາຍລະອຽດ
            </button>
            
            <button 
              onClick={handleBookRoom}
              className="flex-1 px-4 py-3 text-white rounded-lg transition-all duration-200 text-sm font-medium transform hover:scale-105"
              style={{ 
                background: 'linear-gradient(135deg, #d4851c, #f4a261)',
                boxShadow: '0 4px 12px rgba(212, 133, 28, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #b8731a, #d4851c)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 133, 28, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #d4851c, #f4a261)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 133, 28, 0.3)';
              }}
            >
              ຈອງເລີຍ
            </button>
          </div>
        </div>
      </div>

      {/* Quick Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-xl p-8 w-96 max-w-90vw shadow-2xl"
            style={{ border: '2px solid #d4851c' }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#d4851c' }}>
                ຈອງຫ້ອງ
              </h3>
              <p className="text-gray-600 font-medium">
                {room.roomType.TypeName}
              </p>
              <div className="text-xl font-bold mt-2" style={{ color: '#d4851c' }}>
                ₭{room.RoomPrice.toLocaleString()} / ຄືນ
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#d4851c' }}>
                  📅 ວັນທີ່ເຊັກອິນ
                </label>
                <input
                  type="date"
                  value={bookingDates.checkinDate}
                  onChange={(e) => setBookingDates(prev => ({ ...prev, checkinDate: e.target.value }))}
                  className="w-full border-2 rounded-lg px-4 py-3 transition-all duration-200"
                  style={{ borderColor: '#d4851c' }}
                  min={new Date().toISOString().split('T')[0]}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 133, 28, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#d4851c' }}>
                  📅 ວັນທີ່ເຊັກເອົາ
                </label>
                <input
                  type="date"
                  value={bookingDates.checkoutDate}
                  onChange={(e) => setBookingDates(prev => ({ ...prev, checkoutDate: e.target.value }))}
                  className="w-full border-2 rounded-lg px-4 py-3 transition-all duration-200"
                  style={{ borderColor: '#d4851c' }}
                  min={bookingDates.checkinDate || new Date().toISOString().split('T')[0]}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 133, 28, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowBookingForm(false)}
                className="flex-1 px-6 py-3 border-2 rounded-lg transition-all duration-200 font-medium"
                style={{ borderColor: '#d4851c', color: '#d4851c' }}
                disabled={isBooking}
                onMouseEnter={(e) => {
                  if (!isBooking) {
                    e.currentTarget.style.backgroundColor = 'rgba(212, 133, 28, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isBooking) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={handleSubmitBooking}
                className="flex-1 px-6 py-3 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 transform hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #d4851c, #f4a261)',
                  boxShadow: '0 4px 12px rgba(212, 133, 28, 0.3)'
                }}
                disabled={isBooking}
                onMouseEnter={(e) => {
                  if (!isBooking) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #b8731a, #d4851c)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 133, 28, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isBooking) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #d4851c, #f4a261)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 133, 28, 0.3)';
                  }
                }}
              >
                {isBooking ? '⏳ ກຳລັງຈອງ...' : '✅ ຢືນຢັນການຈອງ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const RoomSelectionCards: React.FC<RoomSelectionCardsProps> = ({
  rooms,
  onBookRoom,
  onViewDetails,
  searchFilters
}) => {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <RoomCard
          key={room.RoomId}
          room={room}
          onBookRoom={onBookRoom}
          onViewDetails={onViewDetails}
          defaultBookingDates={{
            checkinDate: searchFilters.checkinDate,
            checkoutDate: searchFilters.checkoutDate
          }}
        />
      ))}
    </div>
  );
};

export default RoomSelectionCards;