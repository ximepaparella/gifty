import dayjs from '@/utils/dayjs';

/**
 * Format a date string to YYYY-MM-DD format
 */
export const formatDateString = (dateString: string | Date): string => {
  return dayjs(dateString).format('YYYY-MM-DD');
};

/**
 * Get current date at start of day
 */
export const getCurrentDateStart = (): dayjs.Dayjs => {
  return dayjs().startOf('day');
};

/**
 * Check if a date is before today (works with Ant Design DatePicker)
 * This function accepts the type that Ant Design's DatePicker passes to disabledDate
 */
export const isBeforeToday = (current: any): boolean => {
  // If no date is provided, return false (not disabled)
  if (!current) return false;
  
  try {
    // Use dayjs to ensure we have a consistent comparison
    const today = getCurrentDateStart();
    
    // Handle the case where current is already a dayjs object
    let currentDate;
    if (dayjs.isDayjs(current)) {
      currentDate = current;
    } else {
      // Try to create a valid dayjs from the input
      currentDate = dayjs(current);
      // Verify it's a valid date
      if (isNaN(currentDate.valueOf())) {
        console.warn("Invalid date passed to isBeforeToday:", current);
        return false;
      }
    }
    
    // Check if the date is before today
    return currentDate.isBefore(today, 'day');
  } catch (error) {
    console.error("Error in isBeforeToday:", error);
    // If there's an error, don't disable the date
    return false;
  }
};

/**
 * Parse date string to a dayjs object for Ant Design's DatePicker
 */
export const parseDate = (dateString?: string): dayjs.Dayjs | undefined => {
  if (!dateString) return undefined;
  
  try {
    // First try to parse with the standard format
    const date = dayjs(dateString, 'YYYY-MM-DD');
    
    // Check if the date is valid
    if (date.isValid()) {
      return date;
    }
    
    // If not, try other common formats
    const formats = ['DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'];
    for (const format of formats) {
      const date = dayjs(dateString, format);
      if (date.isValid()) {
        return date;
      }
    }
    
    // If all else fails, try generic parse
    return dayjs(dateString);
  } catch (error) {
    console.error("Error parsing date:", error);
    return undefined;
  }
};

/**
 * Custom date validation function that doesn't rely on isValid
 */
export const isValidDate = (dateString: string): boolean => {
  // Simple regex to validate YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  // Try creating a date object and check if it's valid
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Function to check if a date is in the future
 */
export const isDateInFuture = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return inputDate >= today;
};

/**
 * Get tomorrow's date in YYYY-MM-DD format for min attribute
 */
export const getTomorrowDateString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

/**
 * Get date 3 months from now (default)
 */
export const getThreeMonthsFromNow = (): string => {
  const threeMonths = new Date();
  threeMonths.setMonth(threeMonths.getMonth() + 3);
  return threeMonths.toISOString().split('T')[0];
};

/**
 * Get date 6 months from now (max)
 */
export const getSixMonthsFromNow = (): string => {
  const sixMonths = new Date();
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  return sixMonths.toISOString().split('T')[0];
}; 