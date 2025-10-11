export const remainingDay = (date) => {
  if (!date) {
    return 0;
  }
  
  // Handle both string and Date object inputs
  let endDate;
  if (typeof date === 'string') {
    // Ensure proper ISO format parsing
    endDate = new Date(date);
  } else if (date instanceof Date) {
    endDate = date;
  } else {
    return 0;
  }
  
  if (isNaN(endDate.getTime())) {
    return 0;
  }
  
  const now = new Date();
  const difference = endDate.getTime() - now.getTime();
  const remaining = difference / (1000 * 60 * 60 * 24);
  
  return Math.ceil(remaining);
}