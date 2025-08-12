import React, { useState, useEffect } from 'react';
import { bookingAttachmentService, BookingAttachmentResponse } from '@/@core/services/booking-attachment.service';

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
    nights?: number;
    totalPrice?: number;
    // Customer information
    customerName: string;
    customerTel?: string;
  };
  language?: 'lao' | 'thai'; // เพิ่มการรองรับภาษา
  onViewDetail?: (bookingId: number) => void;
  onCancel?: (bookingId: number) => void;
  onReview?: (bookingId: number) => void;
  onPrint?: (bookingId: number) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  language = 'lao', // ค่าเริ่มต้นเป็นภาษาลาว
  onViewDetail, 
  onCancel, 
  onReview,
  onPrint 
}) => {
  const [imageError, setImageError] = useState(false);
  const [attachments, setAttachments] = useState<BookingAttachmentResponse[]>([]);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // โหลดไฟล์แนบเมื่อ component mount
  useEffect(() => {
    const loadAttachments = async () => {
      setIsLoadingAttachments(true);
      try {
        const attachmentList = await bookingAttachmentService.getAttachmentsByBookingId(booking.bookingId);
        setAttachments(attachmentList);
        console.log('📎 Loaded attachments:', attachmentList);
      } catch (error) {
        console.error('❌ Failed to load attachments:', error);
      } finally {
        setIsLoadingAttachments(false);
      }
    };

    loadAttachments();
  }, [booking.bookingId]);

  // ฟังก์ชันแสดงใบเสร็จ
  const handleViewReceipt = (attachment: BookingAttachmentResponse) => {
    const imageUrl = bookingAttachmentService.getImageUrl(attachment.FilePath);
    setSelectedReceipt(imageUrl);
    setShowReceiptModal(true);
  };

  // ฟังก์ชันแปลภาษา
  const getText = (laoText: string, thaiText: string) => {
    return language === 'thai' ? thaiText : laoText;
  };

  // กำหนดสีของ status badge
  const getStatusStyle = (statusId: number) => {
    const styles = {
      1: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: '⏳' },
      2: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '✅' },
      3: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: '🏨' },
      4: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: '🎉' },
      5: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '❌' },
    };
    return styles[statusId as keyof typeof styles] || styles[1];
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
    if (booking.nights) return booking.nights;
    const checkin = new Date(booking.checkinDate);
    const checkout = new Date(booking.checkoutDate);
    const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // จัดรูปแบบสกุลเงิน
  const formatCurrency = (amount: number) => {
    return `₭${amount.toLocaleString()}`;
  };

  // Star Rating Component
  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-sm ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  const statusStyle = getStatusStyle(booking.statusId);
  const nights = calculateNights();
  const totalPrice = booking.totalPrice || (booking.roomPrice * nights);

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.02] hover:border-blue-200 group flex flex-col">
      {/* Image Section - ลดความสูงลง */}
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        {!imageError ? (
          <img
            src={booking.roomImage || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'}
            alt={booking.roomType}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🏨</div>
              <div className="text-sm text-gray-600">รูปภาพห้องพัก</div>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} shadow-sm`}>
            <span className="text-xs">{statusStyle.icon}</span>
            {booking.statusName}
          </span>
        </div>

        {/* Booking ID */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 text-gray-800 shadow-sm">
            #{booking.bookingId}
          </span>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="flex-1 flex flex-col p-3">
        {/* Header with Room Type and Price */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-1">
            {booking.roomType}
          </h3>
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg">
            <span className="text-xs font-medium text-gray-700">{getText('ລາຄາຕໍ່ຄືນ', 'ราคาต่อคืน')}</span>
            <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
              <span className="text-xs">₭</span>{booking.roomPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Rating and Reviews */}
        {booking.rating && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
            <StarRating rating={booking.rating} />
            <span className="text-xs text-gray-600">
              {booking.rating} ດາວ ({booking.reviewCount || 0} ລີວິວ)
            </span>
          </div>
        )}

        {/* Room Description */}
        {booking.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {booking.description}
          </p>
        )}

        {/* Booking Details - กระชับขึ้น */}
        <div className="flex-1 flex flex-col justify-between mb-2">
          {/* Check-in/out Dates - แบบกระชับ */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-3 rounded-xl border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-emerald-700">🏠 {getText('ເຊັກອິນ', 'เช็คอิน')}</span>
                </div>
                <span className="text-xs font-bold text-gray-800 bg-white px-2 py-1 rounded-md shadow-sm">
                  {formatDate(booking.checkinDate)}
                </span>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-rose-700">🚪 {getText('ເຊັກເອົາ', 'เช็คเอาต์')}</span>
                </div>
                <span className="text-xs font-bold text-gray-800 bg-white px-2 py-1 rounded-md shadow-sm">
                  {formatDate(booking.checkoutDate)}
                </span>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-blue-700">🌙 {getText('ຄືນ', 'คืน')}</span>
                </div>
                <span className="text-xs font-bold text-gray-800 bg-white px-2 py-1 rounded-md shadow-sm">
                  {calculateNights()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Price - กระชับขึ้น */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-600">ລາຄາລວມທັງໝົດ</div>
              <div className="text-xs text-gray-500">
                {nights} {getText("ຄືນ", "คืน")} × {formatCurrency(booking.roomPrice)}
              </div>
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(totalPrice)}
            </div>
          </div>
        </div>
        
        {/* Customer Information - กระชับขึ้น */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-2 rounded-lg border border-gray-200 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs">👤</span>
                <span className="text-xs font-medium text-gray-700">
                  {getText('ຂໍ້ມູນລູກຄ້າ', 'ข้อมูลลูกค้า')}
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-800">
                {booking.customerName}
              </div>
            </div>
            {booking.customerTel && (
              <div className="text-xs text-gray-600">
                📞 {booking.customerTel}
              </div>
            )}
          </div>
        </div>

        {/* Payment Receipt Section */}
        {attachments.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg border border-green-200 mt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <span className="text-xs">🧾</span>
                <span className="text-xs font-medium text-green-700">
                  {getText('ໃບເສຮັດການຊຳລະ', 'ใบเสร็จการชำระ')}
                </span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                {attachments.length} ໄຟລ໌
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {attachments.map((attachment, index) => (
                <button
                  key={attachment.AttachmentId}
                  onClick={() => handleViewReceipt(attachment)}
                  className="flex-1 min-w-0 px-2 py-1 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors duration-200 text-xs font-medium truncate"
                  title={getText('ຄລິກເພື່ອເບິ່ງໃບເສຮັດ', 'คลิกเพื่อดูใบเสร็จ')}
                >
                  📄 ໃບເສຮັດ {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State for Attachments */}
        {isLoadingAttachments && (
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 mt-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              <span className="text-xs text-gray-600">
                {getText('ກຳລັງໂຫຼດໃບເສຮັດ...', 'กำลังโหลดใบเสร็จ...')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-3 pb-3">
        <div className="flex flex-col gap-1">
          {/* Primary Action */}
          <button 
            onClick={() => onViewDetail?.(booking.bookingId)}
            className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
          >
            <span className="text-xs">👁️</span>
            ລາຍລະອຽດ
          </button>
          
          {/* Secondary Actions */}
          <div className="flex gap-2">
            {booking.statusId === 4 && ( // Checked out - can review
              <button 
                onClick={() => onReview?.(booking.bookingId)}
                className="flex-1 px-3 py-2 text-sm border border-yellow-500 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <span className="text-xs">⭐</span>
                ລີວິວ
              </button>
            )}
            
            {onPrint && (
              <button 
                onClick={() => onPrint?.(booking.bookingId)}
                className="flex-1 px-3 py-2 text-sm border border-gray-400 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <span className="text-xs">🖨️</span>
                ພິມ
              </button>
            )}
            
            {canCancel && (
              <button 
                onClick={() => onCancel?.(booking.bookingId)}
                className="flex-1 px-3 py-2 text-sm border border-red-400 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <span className="text-xs">❌</span>
                ຍົກເລີກ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Image Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {getText('ໃບເສຮັດການຊຳລະ', 'ใบเสร็จการชำระ')}
              </h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <span className="text-xl text-gray-500">×</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4">
              <div className="relative">
                <img
                  src={selectedReceipt}
                  alt={getText('ໃບເສຮັດການຊຳລະ', 'ใบเสร็จการชำระ')}
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '60vh', objectFit: 'contain' }}
                />
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex gap-2 p-4 border-t border-gray-200">
              <a
                href={selectedReceipt}
                download
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center text-sm font-medium"
              >
                📥 {getText('ດາວໂຫຼດ', 'ดาวน์โหลด')}
              </a>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
              >
                {getText('ປິດ', 'ปิด')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;