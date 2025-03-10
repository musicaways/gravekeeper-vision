
/**
 * Utility function to decode HTML entities and fix encoding issues
 * with special characters that might come incorrectly encoded from the database
 */
export const decodeText = (text: string | null | undefined): string => {
  if (!text) return '';
  
  // Create a temporary element to decode HTML entities
  const element = document.createElement('div');
  element.innerHTML = text;
  let decoded = element.textContent || '';
  
  // Fix common encoding problems with special characters
  decoded = decoded
    // Fix degree symbol (°) in various encodings
    .replace(/Ã\u0082Â°/g, '°')
    .replace(/Ã\u0083Â°/g, '°') 
    .replace(/Ã\u00A0°/g, '°')
    .replace(/Ã\u00A0/g, ' ')
    .replace(/Ã\u0083\u0083Ã\u0082\u00B0/g, '°')
    .replace(/Ã\u0083Ã\u0082°/g, '°')
    .replace(/Ã°/g, '°')
    .replace(/nÃ\u0082Â°/g, 'n°')
    .replace(/nÃ\u0083Â°/g, 'n°')
    .replace(/nÃ°/g, 'n°')
    // Fix other common encoding issues
    .replace(/Ã¨/g, 'è')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¬/g, 'ì')
    .replace(/Ã²/g, 'ò')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã /g, 'à');
  
  return decoded;
};
