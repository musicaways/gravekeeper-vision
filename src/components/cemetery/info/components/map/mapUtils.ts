
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
    // When using coordinates, Google Maps adds a marker at the specified location
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

// Clean marker ID by removing any URL parameters
const getCleanMarkerId = (markerId?: string | null): string | null => {
  if (!markerId) return null;
  return markerId.split(/[&?]/)[0];
};

export const openExternalMap = (
  customMapId: string,
  useCustomMap: boolean,
  cemetery: any
): void => {
  if (!cemetery) return;
  
  console.log("Opening external map:", useCustomMap ? "custom" : "standard");
  
  if (useCustomMap) {
    // Per le mappe personalizzate - apriamo il viewer con un livello di zoom maggiore (z=18)
    // e il marker evidenziato
    let url = `https://www.google.com/maps/d/viewer?mid=${customMapId}`;
    
    // Se è stato configurato un ID marker personalizzato, includi il parametro msid
    // e imposta lo zoom a 18 per avvicinarsi di più al marker
    if (cemetery.custom_map_marker_id) {
      // Use the clean marker ID (without URL parameters)
      const cleanMarkerId = getCleanMarkerId(cemetery.custom_map_marker_id);
      
      // Using the marker ID as msid is crucial for highlighting the correct marker
      // Also add the z=18 parameter for a closer zoom to the marker
      url += `&msid=${cleanMarkerId}&z=18`;
      console.log("Opening custom map URL with marker ID:", url);
    } else if (cemetery.Latitudine && cemetery.Longitudine) {
      url += `&ll=${cemetery.Latitudine},${cemetery.Longitudine}&z=16`;
      console.log("Opening custom map URL with coordinates:", url);
    } else {
      console.log("Opening custom map URL without coordinates:", url);
    }
    
    window.open(url, '_blank');
    
    // Messaggio diverso in base alla presenza dell'ID marker
    if (cemetery.custom_map_marker_id) {
      toast.success("Apertura mappa personalizzata con marker configurato");
    } else {
      toast.info("I marker nella mappa personalizzata devono essere aggiunti manualmente nell'editor di Google My Maps");
    }
    return;
  }
  
  // For standard maps - we use the standard Google Maps with automatic markers
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
