
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
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=16&maptype=satellite`;
  } 
  
  if (address) {
    const fullAddress = [
      address,
      city,
      postalCode,
      state,
      country
    ].filter(Boolean).join(', ');
    
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(fullAddress)}&zoom=16&maptype=satellite`;
  }
  
  return '';
};

export const openExternalMap = (
  customMapId: string,
  useCustomMap: boolean,
  cemetery: any
): void => {
  if (!cemetery) return;
  
  console.log("Opening external map:", useCustomMap ? "custom" : "standard");
  
  if (useCustomMap) {
    let url = `https://www.google.com/maps/d/viewer?mid=${customMapId}`;
    if (cemetery.Latitudine && cemetery.Longitudine) {
      url += `&ll=${cemetery.Latitudine},${cemetery.Longitudine}&z=16`;
    }
    console.log("Opening custom map URL:", url);
    window.open(url, '_blank');
    return;
  }
  
  let url = "";
  if (cemetery.Latitudine && cemetery.Longitudine) {
    url = `https://www.google.com/maps/search/?api=1&query=${cemetery.Latitudine},${cemetery.Longitudine}&t=k`;
  } else if (cemetery.Indirizzo) {
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
    console.log("Opening standard map URL:", url);
    window.open(url, '_blank');
  }
};

// Questa funzione è obsoleta e non dovrebbe essere usata
// La lasciamo per compatibilità ma è meglio usare direttamente l'URL embed
export const handleCustomMapView = (
  cemetery: any,
  apiKey: string,
  customMapId: string,
  setMapUrl: (url: string) => void,
  setUseCustomMap: (value: boolean) => void
): void => {
  console.log("WARNING: Using legacy handleCustomMapView function - should be avoided");
  
  if (!cemetery || !cemetery.Latitudine || !cemetery.Longitudine) return;

  const embeddedCustomMapUrl = `https://www.google.com/maps/d/embed?mid=${customMapId}&ll=${cemetery.Latitudine},${cemetery.Longitudine}&z=16`;
  console.log("Setting custom map URL:", embeddedCustomMapUrl);
  setMapUrl(embeddedCustomMapUrl);
};
