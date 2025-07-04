import React from 'react';

interface BookingCardProps {
  booking: {
    bookingId: number;
    roomImage?: string;
    roomType: string;
    roomPrice: number;
    checkinDate: string;
    checkoutDate: string;
    statusId: number;
    statusName: string;
    rating?: number;
    reviewCount?: number;
    description?: string;
  };
  onViewDetail?: (bookingId: number) => void;
  onCancel?: (bookingId: number) => void;
  onReview?: (bookingId: number) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onViewDetail, 
  onCancel, 
  onReview 
}) => {
  // กำหนดสีของ status badge
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Pending
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';       // Confirmed
      case 3: return 'bg-purple-100 text-purple-800 border-purple-200'; // Checked In
      case 4: return 'bg-green-100 text-green-800 border-green-200';    // Checked Out
      case 5: return 'bg-gray-100 text-gray-800 border-gray-200';       // Cancelled
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // เช็คว่าสามารถยกเลิกได้หรือไม่
  const canCancel = booking.statusId === 1 || booking.statusId === 2;

  // แปลงวันที่ให้อ่านง่าย
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // คำนวณจำนวนคืน
  const calculateNights = () => {
    const checkin = new Date(booking.checkinDate);
    const checkout = new Date(booking.checkoutDate);
    const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Star Rating Component
  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden max-w-sm mx-auto">
      {/* Room Image */}
      <div className="relative">
        <img
          src={booking.roomImage || '/images/rooms/default-room.jpg'}
          alt={booking.roomType}
          className="w-full h-48 object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.statusId)}`}>
            {booking.statusName}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        {/* Header with Room Type */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {booking.roomType}
          </h3>
        </div>

        {/* Rating and Reviews */}
        {booking.rating && (
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={booking.rating} />
            <span className="text-sm text-gray-600">
              {booking.rating} Star | {booking.reviewCount || 0} reviews
            </span>
          </div>
        )}

        {/* Room Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {booking.description || "ຫ້ອງພັກສະດວກສະບາຍ ພ້ອມສິ່ງອຳນວຍຄວາມສະດວກຄົບຄັນ ເໝາະສຳລັບການພັກຜ່ອນແລະການເດີນທາງທຸລະກິດ"}
        </p>

        <hr className="my-3 border-gray-200" />

        {/* Booking Details */}
        <div className="space-y-2">
          {/* Check-in/out Dates */}
          <div className="flex items-center gap-2">
            <span className="text-blue-500">📅</span>
            <span className="text-sm">
              <span className="font-medium">ເຊັກອິນ:</span> {formatDate(booking.checkinDate)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-red-500">📅</span>
            <span className="text-sm">
              <span className="font-medium">ເຊັກເອົາ:</span> {formatDate(booking.checkoutDate)}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <span className="text-purple-500">🏨</span>
            <span className="text-sm">
              <span className="font-medium">ຈຳນວນ:</span> {calculateNights()} ຄືນ
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-green-500">💰</span>
            <span className="text-sm">
              <span className="font-medium">ລາຄາ:</span> ฿{booking.roomPrice.toLocaleString()}/ຄືນ
            </span>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 p-3 rounded-lg mt-3">
            <div className="text-center font-semibold text-gray-800">
              ລວມທັງໝົດ: ฿{(booking.roomPrice * calculateNights()).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0">
        <div className="flex gap-2">
          <button 
            onClick={() => onViewDetail?.(booking.bookingId)}
            className="flex-1 px-3 py-2 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <span>📍</span>
            ລາຍລະອຽດ
          </button>
          
          {booking.statusId === 4 && ( // Checked out - can review
            <button 
              onClick={() => onReview?.(booking.bookingId)}
              className="flex-1 px-3 py-2 text-sm border border-gray-500 text-gray-500 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              ລີວິວ
            </button>
          )}
          
          {canCancel && (
            <button 
              onClick={() => onCancel?.(booking.bookingId)}
              className="flex-1 px-3 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
            >
              ຍົກເລີກ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Example usage component
const BookingCardExample = () => {
  const sampleBookings = [
    {
      bookingId: 1,
      roomImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      roomType: "Deluxe Room",
      roomPrice: 2500,
      checkinDate: "2024-01-15",
      checkoutDate: "2024-01-18",
      statusId: 2,
      statusName: "ຢືນຢັນແລ້ວ",
      rating: 4,
      reviewCount: 128,
      description: "ຫ້ອງພັກຫຼູພ້ອມສິ່ງອຳນວຍຄວາມສະດວກຄົບຄັນ ວິວເມືອງທີ່ສວຍງາມ ເໝາະສຳລັບການພັກຜ່ອນແລະການເດີນທາງທຸລະກິດ ມີລະບຽງສ່ວນຕົວແລະອ່າງອາບນ້ຳແບບຈາກຸສຊີ"
    },
    {
      bookingId: 2,
      roomImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      roomType: "Standard Room",
      roomPrice: 1800,
      checkinDate: "2024-02-01",
      checkoutDate: "2024-02-03",
      statusId: 1,
      statusName: "ລໍຖ້າການຢືນຢັນ",
      rating: 4,
      reviewCount: 89,
      description: "ຫ້ອງພັກສະດວກສະບາຍ ພ້ອມສິ່ງອຳນວຍຄວາມສະດວກຄົບຄັນ ເໝາະສຳລັບການພັກຜ່ອນແລະການເດີນທາງທຸລະກິດ"
    },
    {
      bookingId: 3,
      roomImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      roomType: "Suite Room",
      roomPrice: 4200,
      checkinDate: "2023-12-20",
      checkoutDate: "2023-12-23",
      statusId: 4,
      statusName: "ເຊັກເອົາແລ້ວ",
      rating: 5,
      reviewCount: 156,
      description: "ຫ້ອງສະວີດຫຼູຫຼາພ້ອມຫ້ອງນັ່ງເລ່ນແຍກ ຫ້ອງນ້ຳໃຫຍ່ພ້ອມອ່າງແຊ່ຕົວ ວິວທະເລທີ່ງົດງາມ ເໝາະສຳລັບຄູ່ຮັກແລະຄອບຄົວ"
    }
  ];

  const handleViewDetail = (bookingId: number) => {
    alert(`ເບິ່ງລາຍລະອຽດການຈອງ ID: ${bookingId}`);
  };

  const handleCancel = (bookingId: number) => {
    if (confirm('ທ່ານຕ້ອງການຍົກເລີກການຈອງນີ້ບໍ?')) {
      alert(`ຍົກເລີກການຈອງ ID: ${bookingId}`);
    }
  };

  const handleReview = (bookingId: number) => {
    alert(`ຂຽນລີວິວສຳລັບການຈອງ ID: ${bookingId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          ການຈອງຂອງຂ້ອຍ
        </h1>
        
        {/* Grid layout for multiple cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBookings.map((booking) => (
            <BookingCard 
              key={booking.bookingId}
              booking={booking}
              onViewDetail={handleViewDetail}
              onCancel={handleCancel}
              onReview={handleReview}
            />
          ))}
        </div>
        
        {/* Empty state example */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-8 shadow-md max-w-md mx-auto">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">ຍັງບໍ່ມີການຈອງ</h3>
            <p className="text-gray-500 mb-4">ເລີ່ມຕົ້ນການເດີນທາງຂອງທ່ານດ້ວຍການຈອງຫ້ອງພັກກັບເຮົາ</p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
              ເລືອກຫ້ອງພັກ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCardExample;