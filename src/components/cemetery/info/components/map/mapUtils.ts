
import { toast } from "sonner";

export const buildMapUrl = (
  apiKey: string,
  latitude?: number | null,
  longitude?: number | null,
  address?: string,
  city?: string,
  postalCode?: string,
  state?: string,
  country?: string
): string => {
  if (latitude && longitude) {
    // Using coordinates with maximum map customization:
    // - maptype=satellite: Uses satellite view
    // - zoom=18: Closer view of the location
    // - language=it: Italian language UI
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=18&maptype=satellite&language=it`;
  } 
  
  if (address) {
    const fullAddress = [
      address,
      city,
      postalCode,
      state,
      country
    ].filter(Boolean).join(', ');
    
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(fullAddress)}&zoom=16&maptype=satellite&language=it`;
  }
  
  return '';
};

// Open the map in a new tab
export const openExternalMap = (
  customMapId: string,
  useCustomMap: boolean,
  cemetery: any
): void => {
  if (!cemetery) return;
  
  // Always use standard Google Maps now
  let url = "";
  
  if (cemetery.Latitudine && cemetery.Longitudine) {
    // For coordinates, we open Google Maps with satellite view (t=k)
    url = `https://www.google.com/maps/search/?api=1&query=${cemetery.Latitudine},${cemetery.Longitudine}&t=k`;
  } else if (cemetery.Indirizzo) {
    // For address, create a search query
    const address = [
      cemetery.Indirizzo,
      cemetery.city,
      cemetery.postal_code,
      cemetery.state,
      cemetery.country
    ].filter(Boolean).join(', ');
    
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}&t=k`;
  }
  
  if (url) {
    console.log("Opening map URL:", url);
    window.open(url, '_blank');
  }
};
