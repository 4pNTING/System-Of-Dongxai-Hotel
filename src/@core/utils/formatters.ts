// Format utilities for the Dongxai Hotel System

/**
 * Format currency in LAK (Lao Kip) format
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'LAK')
 * @param locale - Locale for formatting (default: 'lo-LA')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | string,
  currency: string = 'LAK',
  locale: string = 'lo-LA'
): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0 ₭';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,  // 💰 แสดงเฉพาะจำนวนเต็ม ไม่มี .00
    }).format(numAmount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails - แสดงเฉพาะจำนวนเต็ม
    return `${Math.round(numAmount).toLocaleString('lo-LA')} ₭`;
  }
};

/**
 * Format number with thousand separators
 * @param value - The number to format
 * @param locale - Locale for formatting (default: 'lo-LA')
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | string,
  locale: string = 'lo-LA'
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0';
  }

  return numValue.toLocaleString(locale);
};

/**
 * Format percentage
 * @param value - The value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number | string,
  decimals: number = 1
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0%';
  }

  return `${numValue.toFixed(decimals)}%`;
};

/**
 * Format date in Lao format
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'lo-LA')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  locale: string = 'lo-LA'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date and time in Lao format
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'lo-LA')
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date: Date | string,
  locale: string = 'lo-LA'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format duration in days
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days between dates
 */
export const formatDuration = (
  startDate: Date | string,
  endDate: Date | string
): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Format phone number for display
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Lao phone numbers (e.g., +856 20 1234 5678)
  if (cleaned.startsWith('856')) {
    const formatted = cleaned.replace(/^856(\d{2})(\d{4})(\d{4})$/, '+856 $1 $2 $3');
    return formatted;
  }
  
  // Format local numbers (e.g., 020 1234 5678)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};
