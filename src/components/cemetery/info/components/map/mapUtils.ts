
import { toast } from "sonner";

// Build map URL for embedded maps
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
    // Using a custom marker icon with markercolor parameter and custom ID
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=18&maptype=satellite&language=it&icon=https://maps.google.com/mapfiles/ms/icons/purple-dot.png`;
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
  } else {
    toast({
      title: "Errore",
      description: "Non ci sono abbastanza informazioni per aprire la mappa"
    });
  }
};

// Add a custom script to make Google Maps embedded iframe use single finger panning
export const injectSingleFingerPanScript = (iframeId: string): void => {
  try {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;
    
    // This script tries to modify the embedded map to allow single finger panning
    // Note: This may not work in all cases due to cross-origin restrictions
    const script = `
      try {
        const mapElement = document.querySelector('.gm-style');
        if (mapElement) {
          // Attempt to modify the gesture handling
          mapElement.style.touchAction = 'pan-x pan-y';
          
          // Try to find and modify the map instance
          const maps = Object.values(window).filter(val => 
            val && typeof val === 'object' && val._panes && val.setOptions
          );
          
          if (maps.length > 0) {
            maps[0].setOptions({gestureHandling: 'greedy'});
            console.log('Modified map gesture handling');
          }
        }
      } catch (e) {
        console.error('Error modifying map:', e);
      }
    `;
    
    // Attempt to inject the script
    setTimeout(() => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(script, '*');
        }
      } catch (e) {
        console.warn('Could not inject script to iframe due to cross-origin policy:', e);
      }
    }, 1000);
  } catch (error) {
    console.error('Error injecting script:', error);
  }
};
