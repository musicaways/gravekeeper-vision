
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
  
  if (useCustomMap) {
    let url = `https://www.google.com/maps/d/viewer?mid=${customMapId}`;
    if (cemetery.Latitudine && cemetery.Longitudine) {
      url += `&ll=${cemetery.Latitudine},${cemetery.Longitudine}&z=16`;
    }
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
    window.open(url, '_blank');
  }
};

export const handleCustomMapView = (
  cemetery: any,
  apiKey: string,
  customMapId: string,
  setMapUrl: (url: string) => void,
  setUseCustomMap: (value: boolean) => void
): void => {
  if (!cemetery || !cemetery.Latitudine || !cemetery.Longitudine) return;

  // Utilizziamo l'embed di Google Maps standard ma centrato sulla posizione del cimitero
  const embeddedCustomMapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${cemetery.Latitudine},${cemetery.Longitudine}&zoom=16&maptype=satellite`;
  setMapUrl(embeddedCustomMapUrl);
  
  // Notifica all'utente che il marker verrà visualizzato solo nella vista standard
  toast.info("Il marker della posizione è visibile solo nella vista standard. Per vedere la mappa personalizzata, aprila in Google Maps.", {
    duration: 5000
  });
  
  // Modifichiamo il comportamento per aprire la mappa personalizzata in Google Maps
  setTimeout(() => {
    const customMapUrl = `https://www.google.com/maps/d/viewer?mid=${customMapId}`;
    window.open(customMapUrl, '_blank');
    // Torniamo alla vista standard dopo aver aperto la mappa personalizzata
    setUseCustomMap(false);
  }, 500);
};
