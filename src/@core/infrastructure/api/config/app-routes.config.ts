// src/presentation/config/app-routes.config.ts
const createRoutes = (baseUrl: string) => ({
  BASE_URL: baseUrl,
  LIST: `${baseUrl}/list`,
  CREATE: `${baseUrl}/create`,
  EDIT: (id: string | number) => `${baseUrl}/edit/${id}`,
  DETAIL: (id: string | number) => `${baseUrl}/detail/${id}`,
});

export const APP_ROUTES = {
  // ===== Staff Admin Routes =====
  DASHBOARD_ROUTE: '/dashboards/crm',
  CUSTOMER_ROUTE: createRoutes('/customers'),
  ROOM_ROUTE: createRoutes('/rooms'),
  ROOM_TYPE_ROUTE: createRoutes('/room-types'),
  BOOKING_ROUTE: createRoutes('/bookings'),
  BOOKING_STATUS_ROUTE: createRoutes('/booking-statuses'),
  PAYMENT_ROUTE: createRoutes('/payments'),
  REPORT_ROUTE: {
    BASE_URL: '/reports',
    REVENUE: '/reports/revenue',
    OCCUPANCY: '/reports/occupancy',
    BOOKING: '/reports/booking',
  },
  SETTINGS_ROUTE: '/settings',
  STAFF_ROUTE: createRoutes('/staffs'),
  
  // ===== Room Gallery Routes (Admin) =====
  ROOM_GALLERY_ROUTE: {
    BASE_URL: '/room-galleries',
    LIST: '/room-galleries/list',
    CREATE: '/room-galleries/create',
    EDIT: (id: string | number) => `/room-galleries/edit/${id}`,
    DETAIL: (id: string | number) => `/room-galleries/detail/${id}`,
    MANAGE: (roomId: string | number) => `/room-galleries/manage/${roomId}`,
  },

  // ===== Customer Public Routes =====
  CUSTOMER_HOME: '/home',
  CUSTOMER_ROOMS: {
    BASE_URL: '/rooms',
    LIST: '/rooms',
    DETAIL: (id: string | number) => `/rooms/detail/${id}`,
    GALLERY: (id: string | number) => `/rooms/gallery/${id}`,
    BOOK: (id: string | number) => `/rooms/book/${id}`,
  },
  CUSTOMER_BOOKING: {
    BASE_URL: '/my-bookings',
    LIST: '/my-bookings',
    HISTORY: '/my-bookings/history',
    DETAIL: (id: string | number) => `/my-bookings/detail/${id}`,
    CANCEL: (id: string | number) => `/my-bookings/cancel/${id}`,
  },
  CUSTOMER_BOOK_NOW: {
    BASE_URL: '/book-now',
    STEP1: '/book-now/select-room',
    STEP2: '/book-now/select-dates',
    STEP3: '/book-now/customer-info',
    STEP4: '/book-now/confirmation',
    SUCCESS: (bookingId: string | number) => `/book-now/success/${bookingId}`,
  },
  CUSTOMER_PROFILE: '/profile',
  CUSTOMER_SETTINGS: '/user-settings',

  // ===== Auth Routes =====
  AUTH_ROUTES: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/logout',
  },

  // ===== Public Routes =====
  PUBLIC_ROUTES: {
    HOMEPAGE: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    ROOMS_SHOWCASE: '/rooms-showcase',
    GALLERY: '/gallery',
    SERVICES: '/services',
  },

  // ===== Error Routes =====
  ERROR_ROUTES: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/401',
    SERVER_ERROR: '/500',
  },
} as const;

export const {
  // Staff Admin routes exports
  DASHBOARD_ROUTE,
  CUSTOMER_ROUTE,
  ROOM_ROUTE,
  ROOM_GALLERY_ROUTE, // ✅ เพิ่ม
  ROOM_TYPE_ROUTE,
  BOOKING_ROUTE,
  BOOKING_STATUS_ROUTE,
  PAYMENT_ROUTE,
  REPORT_ROUTE,
  SETTINGS_ROUTE,
  STAFF_ROUTE,
  
  // Customer routes exports
  CUSTOMER_HOME,
  CUSTOMER_ROOMS, // ✅ เพิ่ม
  CUSTOMER_BOOKING,
  CUSTOMER_BOOK_NOW, // ✅ ขยาย
  CUSTOMER_PROFILE,
  CUSTOMER_SETTINGS,

  // Auth routes exports
  AUTH_ROUTES, // ✅ เพิ่ม

  // Public routes exports  
  PUBLIC_ROUTES, // ✅ เพิ่ม

  // Error routes exports
  ERROR_ROUTES, // ✅ เพิ่ม
} = APP_ROUTES;