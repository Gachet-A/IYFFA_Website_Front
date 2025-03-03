
import { format, isAfter, isBefore, parseISO } from "date-fns";

// Function to format SQL DateTime to display format with time
export const formatEventDate = (sqlDate: string, endDate?: string): string => {
  const date = parseISO(sqlDate);
  
  if (!endDate) {
    return format(date, "d MMMM yyyy 'at' h:mm a");
  }
  
  const end = parseISO(endDate);
  
  // Format with both start and end dates
  return `${format(date, "d MMMM yyyy 'at' h:mm a")} - ${format(end, "d MMMM yyyy 'at' h:mm a")}`;
};

// Function to format SQL DateTime to a range display format with time
export const formatEventDateRange = (startDate: string, endDate?: string): string => {
  return formatEventDate(startDate, endDate);
};

// Check if date is in the past
export const isPastEvent = (eventDate: string): boolean => {
  const date = parseISO(eventDate);
  const today = new Date();
  return isBefore(date, today);
};

// Check if date is in the future
export const isFutureEvent = (eventDate: string): boolean => {
  const date = parseISO(eventDate);
  const today = new Date();
  return isAfter(date, today);
};
