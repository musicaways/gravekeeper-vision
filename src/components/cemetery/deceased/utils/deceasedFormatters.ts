
// Function to format the date from database format to readable format
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  
  try {
    // Try to parse the date - can handle both ISO strings and DD/MM/YYYY formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If date is invalid, return original string
      return dateString;
    }
    
    // Format date as DD/MM/YYYY
    return date.toLocaleDateString('it-IT');
  } catch (error) {
    return dateString;
  }
};
