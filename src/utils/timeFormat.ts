// File: src/utils/timeFormat.ts

export const formatTime = (timestamp: number): string => {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);
  
  // Get hours and minutes from the date
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Format as HH:MM with padded zeros
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};