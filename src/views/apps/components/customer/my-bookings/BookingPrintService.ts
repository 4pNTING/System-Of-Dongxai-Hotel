// BookingPrintService.ts - ແຍກສ່ວນການພິມອອກມາ
interface BookingType {
  bookingId: number
  roomType: string
  roomPrice: number
  checkinDate: string
  checkoutDate: string
  statusId: number
  statusName: string
  nights?: number
  totalPrice?: number
  // Customer information for receipt
  customerName?: string
  customerTel?: string
}

interface BookingStatusType {
  [key: number]: {
    color: 'success' | 'warning' | 'info' | 'error' | 'secondary'
    label: string
    icon: string
  }
}

export class BookingPrintService {
  private static bookingStatusObj: BookingStatusType = {
    1: { color: 'warning', label: 'ລໍຖ້າການຢືນຢັນ', icon: '⏳' },
    2: { color: 'info', label: 'ຢືນຢັນແລ້ວ', icon: '✅' },
    3: { color: 'success', label: 'ເຊັກອິນແລ້ວ', icon: '🏨' },
    4: { color: 'secondary', label: 'ເຊັກເອົາແລ້ວ', icon: '🎉' },
    5: { color: 'error', label: 'ຍົກເລີກແລ້ວ', icon: '❌' }
  }

  // ✅ ฟังก์ชันจัดรูปแบบสกุลเงิน
  private static formatCurrency(amount: number): string {
    return `₭${amount.toLocaleString()}`
  }

  // ✅ ฟังก์ชันจัดรูปแบบวันที่
  private static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('lo-LA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // ✅ ฟังก์ชันสร้าง CSS class สำหรับ status
  private static getStatusClass(statusId: number): string {
    const statusClasses = {
      1: 'pending',
      2: 'confirmed', 
      3: 'checkedin',
      4: 'completed',
      5: 'cancelled'
    }
    return statusClasses[statusId as keyof typeof statusClasses] || 'pending'
  }

  // ✅ ຟັງຊັນສ້າງ CSS Styles ເພື່ອການພິມພ໌ຂະໜາດ A4
  private static getPrintStyles(): string {
    return `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @page {
          size: A4;
          margin: 0;
        }
        
        body {
          font-family: 'Noto Sans Lao', 'Phetsarath OT', 'Saysettha OT', sans-serif;
          line-height: 1.5;
          color: #2c3e50;
          background: white;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
        }
        
        .booking-card {
          width: 210mm; /* ຂະໜາດຄວາມກວ້າງຂອງ A4 */
          height: 297mm; /* ຂະໜາດຄວາມສູງຂອງ A4 */
          margin: 0 auto;
          background: white;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .booking-card {
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          }
          
          .booking-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
            z-index: 10;
          }
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%) translateY(-100%); }
          50% { transform: translateX(-50%) translateY(-50%); }
        }
        
        .hotel-logo {
          font-size: 3rem;
          margin-bottom: 8px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .hotel-name {
          font-size: 2rem;
          margin-bottom: 5px;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .hotel-tagline {
          font-size: 1rem;
          opacity: 0.95;
          font-weight: 300;
          margin-bottom: 10px;
        }
        
        .booking-id {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 10px;
          background: rgba(255,255,255,0.2);
          display: inline-block;
          padding: 5px 15px;
          border-radius: 30px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 5px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        
        .status-pending {
          background-color: #ffeaa7;
          color: #b7791f;
        }
        
        .status-confirmed {
          background-color: #c6f6d5;
          color: #2f855a;
        }
        
        .status-checkedin {
          background-color: #bee3f8;
          color: #2b6cb0;
        }
        
        .status-completed {
          background-color: #e9d8fd;
          color: #6b46c1;
        }
        
        .status-cancelled {
          background-color: #fed7d7;
          color: #c53030;
        }
        
        .content {
          padding: 20px;
          background: white;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .section {
          margin-bottom: 15px;
          border-radius: 10px;
          background: white;
          padding: 15px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .section {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
            transition: transform 0.2s ease;
          }
          
          .section:hover {
            transform: translateY(-2px);
          }
        }
        
        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #3498db;
          position: relative;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .section-title {
            background: linear-gradient(90deg, #3498db, #9b59b6);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            border-bottom: none;
          }
          
          .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, #3498db, #9b59b6);
            border-radius: 2px;
          }
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }
        
        .info-item {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          border-left: 3px solid #3498db;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .info-item {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          }
          
          .info-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }
        }
        
        .info-label {
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 5px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        
        .info-value {
          font-size: 1rem;
          font-weight: 700;
          color: #2c3e50;
        }
        
        .date-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }
        
        .date-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #ecf0f1;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .date-item {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
          }
          
          .date-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }
        }
        
        .date-icon {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .date-icon {
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
          }
        }
        
        .date-label {
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 5px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        
        .date-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
        }
        
        .price-breakdown {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .price-breakdown {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          }
        }
        
        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 0.95rem;
        }
        
        .price-row:last-child {
          border-bottom: none;
        }
        
        .price-total {
          font-weight: 800;
          font-size: 1.2rem;
          color: #27ae60;
          background: #e8f8f5;
          padding: 12px;
          border-radius: 8px;
          margin-top: 10px;
          border: 1px solid #a3e9a4;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .price-total {
            box-shadow: 0 4px 10px rgba(39, 174, 96, 0.2);
          }
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }
        
        .contact-item {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          border-left: 3px solid #e74c3c;
        }
        
        /* ສຳລັບການສະແດງຜົນໃນໜ້າຈໍ */
        @media screen {
          .contact-item {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          }
          
          .contact-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }
        }
        
        .footer {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 15px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: slide 2s ease-in-out infinite;
        }
        
        @keyframes slide {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .footer p {
          margin-bottom: 10px;
          font-weight: 500;
        }
        
        .footer p:first-child {
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
          body { 
            background: white; 
          }
          .booking-card { 
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            box-shadow: none; 
            border: none;
            border-radius: 0;
          }
          .header, .footer {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            print-color-adjust: exact;
          }
          .section, .info-item, .date-item, .contact-item, .price-breakdown {
            box-shadow: none;
            border: 1px solid #ddd;
          }
          .section-title {
            color: #2c3e50;
            -webkit-text-fill-color: #2c3e50;
          }
          .section:hover, .info-item:hover, .date-item:hover, .contact-item:hover {
            transform: none;
            box-shadow: none;
          }
        }
      </style>
    `
  }

  // ✅ ຟັງຊັນສ້າງ HTML Content
  private static generatePrintHTML(booking: BookingType): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ລາຍລະອຽດການຈອງ - #${booking.bookingId}</title>
        <meta charset="UTF-8">
        ${this.getPrintStyles()}
      </head>
      <body>
        <div class="booking-card">
          <!-- Header -->
          <div class="header">
            <div class="hotel-logo">🏨</div>
            <div class="hotel-name">ໂຮງແຮມດົງໄຊ</div>
            <div class="hotel-tagline">ຫຼູຫຼາ & ສະດວກສະບາຍ</div>
            <div class="booking-id">ການຈອງ #${booking.bookingId}</div>
            <div class="status-badge status-${this.getStatusClass(booking.statusId)}">
              ${this.bookingStatusObj[booking.statusId]?.icon} ${this.bookingStatusObj[booking.statusId]?.label}
            </div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <!-- Room Information -->
            <div class="section">
              <div class="section-title">🛏️ ຂໍ້ມູນຫ້ອງພັກ</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">ປະເພດຫ້ອງ</div>
                  <div class="info-value">${booking.roomType}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ລາຄາຕໍ່ຄືນ</div>
                  <div class="info-value">${this.formatCurrency(booking.roomPrice)}</div>
                </div>
              </div>
            </div>
            
            <!-- Customer Information -->
            <div class="section">
              <div class="section-title">👤 ຂໍ້ມູນລູກຄ້າ</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">ຊື່ລູກຄ້າ</div>
                  <div class="info-value">${booking.customerName || 'ບໍ່ລະບຸ'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ເບີໂທລະສັບ</div>
                  <div class="info-value">${booking.customerTel || 'ບໍ່ລະບຸ'}</div>
                </div>
              </div>
            </div>
            
            <!-- Dates -->
            <div class="section">
              <div class="section-title">📅 ວັນທີ່ເຂົ້າພັກ</div>
              <div class="date-section">
                <div class="date-item">
                  <div class="date-icon">🟢</div>
                  <div class="date-label">ເຊັກອິນ</div>
                  <div class="date-value">${this.formatDate(booking.checkinDate)}</div>
                  <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">14:00</div>
                </div>
                <div class="date-item">
                  <div class="date-icon">🏨</div>
                  <div class="date-label">ຈຳນວນຄືນ</div>
                  <div class="date-value">${booking.nights} ຄືນ</div>
                </div>
                <div class="date-item">
                  <div class="date-icon">🔴</div>
                  <div class="date-label">ເຊັກເອົາ</div>
                  <div class="date-value">${this.formatDate(booking.checkoutDate)}</div>
                  <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">12:00</div>
                </div>
              </div>
            </div>
            
            <!-- Price Breakdown -->
            <div class="section">
              <div class="section-title">💰 ລາຍລະອຽດລາຄາ</div>
              <div class="price-breakdown">
                <div class="price-row">
                  <span>${booking.roomType} × ${booking.nights} ຄືນ</span>
                  <span>${this.formatCurrency(booking.roomPrice * (booking.nights || 1))}</span>
                </div>
                <div class="price-row">
                  <span>ຄ່າບໍລິການ</span>
                  <span>ລວມແລ້ວ</span>
                </div>
                <div class="price-row">
                  <span>ພາສີ VAT (0%)</span>
                  <span>₭0</span>
                </div>
                <div class="price-row price-total">
                  <span>ລວມທັງໝົດ</span>
                  <span>${this.formatCurrency(booking.totalPrice || 0)}</span>
                </div>
              </div>
            </div>
            
        
          
          <!-- Footer -->
          <div class="footer">
            <p><strong>ຂອບໃຈທີ່ເລືອກພັກກັບໂຮງແຮມດົງໄຊ</strong></p>
            <p>ພິມເມື່ອ: ${new Date().toLocaleDateString('lo-LA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            // Small delay to ensure styles are loaded
            setTimeout(function() {
              window.print();
            }, 500);
            
            // Auto close after print dialog
            window.addEventListener('afterprint', function() {
              window.close();
            });
            
            // Fallback close after 30 seconds
            setTimeout(function() {
              window.close();
            }, 30000);
          }
        </script>
      </body>
      </html>
    `
  }

  // ✅ ฟังก์ชันหลักสำหรับพิมพ์
  static printBooking(booking: BookingType): void {
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')
      
      if (!printWindow) {
        alert('ກະລຸນາອະນຸຍາດການເປີດ popup ເພື່ອພິມ\nPlease allow popups to print booking details')
        return
      }

      const printContent = this.generatePrintHTML(booking)
      
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      // Focus on print window
      printWindow.focus()
      
    } catch (error) {
      console.error('Error opening print window:', error)
      alert('ເກີດຂໍ້ຜິດພາດໃນການພິມ\nError occurred while printing')
    }
  }

  // ✅ ฟังก์ชันสร้าง PDF (สำหรับอนาคต)
  static async generatePDF(booking: BookingType): Promise<void> {
    // This can be implemented with libraries like jsPDF or Puppeteer
    alert('ຟີເຈີ PDF ຈະມາໃນອະນາຄົດ\nPDF feature coming soon')
  }

  // ✅ ฟังก์ชันส่งทางอีเมล (สำหรับอนาคต)
  static async emailBooking(booking: BookingType, email: string): Promise<void> {
    // This can be implemented with email API
    alert(`ຟີເຈີສົ່ງອີເມວໄປທີ່ ${email} ຈະມາໃນອະນາຄົດ\nEmail feature to ${email} coming soon`)
  }
}