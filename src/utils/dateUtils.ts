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
  
  // Use dayjs to ensure we have a consistent comparison
  const today = getCurrentDateStart();
  
  // Handle the case where current is already a dayjs object
  const currentDate = dayjs.isDayjs(current) ? current : dayjs(current);
  
  // Check if the date is before today
  return currentDate.isBefore(today, 'day');
};

/**
 * Parse date string to a dayjs object for Ant Design's DatePicker
 */
export const parseDate = (dateString?: string): dayjs.Dayjs | undefined => {
  if (!dateString) return undefined;
  
  try {
    return dayjs(dateString);
  } catch (error) {
    console.error("Error parsing date:", error);
    return undefined;
  }
}; 