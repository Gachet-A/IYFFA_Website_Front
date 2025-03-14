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
export const formatEventDateRange = (startDateTime: string, endDateTime?: string): string => {
  const start = parseISO(startDateTime);
  if (!endDateTime) {
    return start.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const end = parseISO(endDateTime);
  return `${start.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })} - ${end.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

// Check if date is in the past
export const isPastEvent = (date: Date | string): boolean => {
  const eventDate = date instanceof Date ? date : new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};

// Check if date is in the future
export const isFutureEvent = (eventDate: string): boolean => {
  const date = parseISO(eventDate);
  const today = new Date();
  return isAfter(date, today);
};
