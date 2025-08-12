const ENDPOINTS = {
    AUTH: {
        BASE_URL: '/auth' as const,
        get LOGIN() { return `${this.BASE_URL}/login` },
        get REGISTER() { return `${this.BASE_URL}/register` },
        get REFRESH() { return `${this.BASE_URL}/refresh` },
        get LOGOUT() { return `${this.BASE_URL}/logout` }
    },
    CUSTOMER: {
        BASE_URL: '/customers' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        get REGISTER() { return `${this.BASE_URL}/register` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    // ===== เพิ่ม CUSTOMER BOOKING ENDPOINTS =====
    CUSTOMER_BOOKING: {
        BASE_URL: '/customer/booking' as const,
        get ROOMS() { return `${this.BASE_URL}/rooms` },
        get BOOK() { return `${this.BASE_URL}/book` },
        get HISTORY() { return `${this.BASE_URL}/history` },
        ROOM_DETAIL: function (roomId: number) { return `${this.BASE_URL}/rooms/${roomId}` },
        BOOKING_DETAIL: function (bookingId: number) { return `${this.BASE_URL}/detail/${bookingId}` },
        CANCEL_BOOKING: function (bookingId: number) { return `${this.BASE_URL}/cancel/${bookingId}` }
    },
    STAFF: {
        BASE_URL: '/staff' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    ROOM: {
        BASE_URL: '/rooms' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        get AVAILABLE() { return `${this.BASE_URL}/available` },
        // ===== เพิ่ม Room Gallery Endpoints =====
        get AVAILABLE_FOR_BOOKING() { return `${this.BASE_URL}/available-for-booking` },
        get ROOM_DETAILS() { return `${this.BASE_URL}/room-details` },
        get SEARCH() { return `${this.BASE_URL}/search` },
        get ROOM_STATS() { return `${this.BASE_URL}/room-stats` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    // ===== เพิ่ม ROOM GALLERY ENDPOINTS =====
    ROOM_GALLERY: {
        BASE_URL: '/room-galleries' as const,
        get CREATE() { return `${this.BASE_URL}` },
        get QUERY() { return `${this.BASE_URL}/query` },
        get FIND_ONE() { return `${this.BASE_URL}/find-one` },
        get FIND_BY_ROOM() { return `${this.BASE_URL}/find-by-room` },
        get FIND_MAIN_IMAGE() { return `${this.BASE_URL}/find-main-image` },
        get SET_MAIN_IMAGE() { return `${this.BASE_URL}/set-main-image` },
        get REORDER() { return `${this.BASE_URL}/reorder` },
        get STATS() { return `${this.BASE_URL}/stats` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    ROOM_TYPE: {
        BASE_URL: '/room-types' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    ROOM_STATUS: {
        BASE_URL: '/room-statuses' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    BOOKING: {
        BASE_URL: '/bookings' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` },
        CHANGE_STATUS: function (id: number, status: string) {
            return `${this.BASE_URL}/${id}/status/${status}`
        },
        // ===== Workflow Endpoints =====
        CONFIRM: function (id: number) { return `${this.BASE_URL}/${id}/confirm` },
        CHECKIN: function (id: number) { return `${this.BASE_URL}/${id}/checkin` },
        CHECKOUT: function (id: number) { return `${this.BASE_URL}/${id}/checkout` }
    },
    BOOKING_STATUS: {
        BASE_URL: '/booking-statuses' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` }
    },
    // ===== CHECKIN ENDPOINTS =====
    CHECKIN: {
        BASE_URL: '/check-in' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        get CURRENT() { return `${this.BASE_URL}/current/list` },
        get STATS() { return `${this.BASE_URL}/stats/summary` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` },
        BY_BOOKING: function (bookingId: number) { return `${this.BASE_URL}/booking/${bookingId}` },
        BY_CUSTOMER: function (customerId: number) { return `${this.BASE_URL}/customer/${customerId}` },
        CHECKIN_BOOKING: function (bookingId: number) { return `${this.BASE_URL}/${bookingId}/checkin` }
    },
    // ===== CHECKOUT ENDPOINTS =====
    CHECKOUT: {
        BASE_URL: '/check-out' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        get TODAY() { return `${this.BASE_URL}/today` },
        get STATS() { return `${this.BASE_URL}/stats` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        UPDATE: function (id: number) { return `${this.BASE_URL}/${id}` },
        DELETE: function (id: number) { return `${this.BASE_URL}/${id}` },
        BY_CHECKIN: function (checkInId: number) { return `${this.BASE_URL}/by-checkin/${checkInId}` },
        CHECKOUT_CHECKIN: function (checkInId: number) { return `${this.BASE_URL}/${checkInId}/checkout` }
    },
    PAYMENT: {
        BASE_URL: '/payments' as const,
        get GET() { return `${this.BASE_URL}/query` },
        get CREATE() { return `${this.BASE_URL}/create` },
        DETAIL: function (id: number) { return `${this.BASE_URL}/${id}` },
        BY_BOOKING: function (bookingId: number) { return `${this.BASE_URL}/booking/${bookingId}` }
    },
    DASHBOARD: {
        BASE_URL: '/dashboard' as const,
        get SUMMARY() { return `${this.BASE_URL}/summary` },
        get REVENUE() { return `${this.BASE_URL}/revenue` },
        get OCCUPANCY() { return `${this.BASE_URL}/occupancy` },
        get BOOKINGS() { return `${this.BASE_URL}/bookings` }
    },
    // ===== BOOKING ATTACHMENT ENDPOINTS =====
    BOOKING_ATTACHMENT: {
        BASE_URL: '/booking-attachments' as const,
        UPLOAD: function (bookingId: number) { return `${this.BASE_URL}/${bookingId}/upload` },
        BY_BOOKING: function (bookingId: number) { return `${this.BASE_URL}/booking/${bookingId}` },
        DELETE: function (attachmentId: number) { return `${this.BASE_URL}/${attachmentId}` },
        DOWNLOAD: function (attachmentId: number) { return `${this.BASE_URL}/${attachmentId}/download` }
    },
    REPORTS: {
        BASE_URL: '/reports' as const,
        get DASHBOARD() { return `${this.BASE_URL}/dashboard` },
        get FINANCIAL() { return `${this.BASE_URL}/financial` },
        get BOOKING() { return `${this.BASE_URL}/booking` },
        get ROOM() { return `${this.BASE_URL}/room` },
        get CUSTOMER() { return `${this.BASE_URL}/customer` },
        get REVENUE() { return `${this.BASE_URL}/revenue` },
        get OCCUPANCY() { return `${this.BASE_URL}/occupancy` },
        get PAYMENTS() { return `${this.BASE_URL}/payments` }
    }
} as const;

// ===== อัปเดต exports =====
export const {
    AUTH: AUTH_ENDPOINTS,
    CUSTOMER: CUSTOMER_ENDPOINTS,
    CUSTOMER_BOOKING: CUSTOMER_BOOKING_ENDPOINTS, // 
    STAFF: STAFF_ENDPOINTS,
    ROOM: ROOM_ENDPOINTS,
    ROOM_GALLERY: ROOM_GALLERY_ENDPOINTS, // 
    ROOM_TYPE: ROOM_TYPE_ENDPOINTS,
    ROOM_STATUS: ROOM_STATUS_ENDPOINTS,
    BOOKING: BOOKING_ENDPOINTS,
    BOOKING_STATUS: BOOKING_STATUS_ENDPOINTS,
    BOOKING_ATTACHMENT: BOOKING_ATTACHMENT_ENDPOINTS, // New booking attachment endpoints
    CHECKIN: CHECKIN_ENDPOINTS,
    CHECKOUT: CHECKOUT_ENDPOINTS,
    PAYMENT: PAYMENT_ENDPOINTS,
    DASHBOARD: DASHBOARD_ENDPOINTS,
    REPORTS: REPORTS_ENDPOINTS
} = ENDPOINTS;