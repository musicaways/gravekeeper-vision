
import React, { useRef, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";
import { toast } from "sonner";

interface JavaScriptMapProps {
  cemetery: any;
  forceRefresh: number;
  onError: (error: string) => void;
}

const JavaScriptMap: React.FC<JavaScriptMapProps> = ({ cemetery, forceRefresh, onError }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const { isLoaded, isError, loadingError } = useGoogleMapsApi();
  
  // Map configuration
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;
    
    try {
      const { Latitudine, Longitudine, Nome } = cemetery;
      
      // Check for valid coordinates
      if (!Latitudine || !Longitudine) {
        onError("Coordinate non disponibili per questo cimitero");
        return;
      }
      
      const mapPosition = { 
        lat: parseFloat(Latitudine), 
        lng: parseFloat(Longitudine) 
      };
      
      // Enhanced map styling for better visuals - minimal style without roads and labels
      const mapStyles = [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#cbe8b9" }]
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#e8f5e9" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#bbdefb" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9c9c9" }, { weight: 0.8 }]
        },
        {
          featureType: "transit",
          stylers: [{ visibility: "off" }]
        }
      ];
      
      // Custom map options - enabling two-finger rotation and single finger panning with flat view by default
      const mapOptions: google.maps.MapOptions = {
        center: mapPosition,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        disableDefaultUI: true,
        scrollwheel: false,
        clickableIcons: false,
        styles: mapStyles,
        gestureHandling: 'greedy', // Abilita la navigazione con un dito (greedy mode)
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false // Rimuove i controlli dello zoom
      };
      
      // Initialize the map
      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      
      // Use the standard marker instead of a custom circle marker
      const markerOptions: google.maps.MarkerOptions = {
        position: mapPosition,
        map: newMap,
        animation: google.maps.Animation.DROP,
        title: Nome || 'Cimitero',
        // Use the standard Google Maps marker with purple color
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
          scaledSize: new google.maps.Size(32, 32),
        }
      };
      
      const newMarker = new google.maps.Marker(markerOptions);
      
      // Create info window with cemetery info
      const infoContent = `
        <div style="padding: 10px; max-width: 200px; font-family: 'Inter', sans-serif;">
          <h3 style="margin: 0 0 5px; font-size: 16px; color: #3b82f6;">${Nome || 'Cimitero'}</h3>
          <p style="margin: 5px 0; font-size: 13px; color: #4b5563;">
            Lat: ${Latitudine.toFixed(6)}<br>
            Lng: ${Longitudine.toFixed(6)}
          </p>
          ${cemetery.Indirizzo ? `<p style="margin: 5px 0; font-size: 13px;">${cemetery.Indirizzo}</p>` : ''}
        </div>
      `;
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
        maxWidth: 250
      });
      
      // Show info window on marker click
      google.maps.event.addListener(newMarker, 'click', () => {
        infoWindow.open(newMap, newMarker);
      });
      
      // Add tiles loaded event listener
      google.maps.event.addListener(newMap, 'tilesloaded', () => {
        if (!mapLoaded) {
          setMapLoaded(true);
          toast.success("Mappa caricata con successo", { duration: 2000 });
        }
      });
      
      // Add tilt control - a custom control for toggling 45° view
      const tiltControlDiv = document.createElement('div');
      const tiltControl = createTiltControl(tiltControlDiv, newMap);
      newMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(tiltControlDiv);
      
      // Save references
      setMap(newMap);
      setMarker(newMarker);
      
      // Add listener for errors
      const errorListener = google.maps.event.addListener(newMap, 'error', () => {
        onError("Errore durante il caricamento della mappa");
      });
      
      return () => {
        // Cleanup listeners on component unmount
        if (errorListener) {
          google.maps.event.removeListener(errorListener);
        }
      };
    } catch (error) {
      console.error("Errore nell'inizializzazione della mappa:", error);
      onError(error instanceof Error ? error.message : "Errore sconosciuto");
    }
  }, [isLoaded, cemetery, forceRefresh, onError, mapLoaded]);
  
  // Function to create the tilt control
  const createTiltControl = (controlDiv: HTMLDivElement, map: google.maps.Map) => {
    // Set CSS for the control border
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '10px';
    controlUI.style.marginRight = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Clicca per attivare/disattivare la vista inclinata';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    const controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.lineHeight = '20px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = '3D';
    controlUI.appendChild(controlText);

    // Setup the click event listener
    let isTilted = false;
    controlUI.addEventListener('click', () => {
      isTilted = !isTilted;
      if (isTilted) {
        // Set to 45 degrees for 3D view
        map.setOptions({ tilt: 45 });
      } else {
        // Set to 0 degrees for 2D view
        map.setOptions({ tilt: 0 });
      }
      controlText.innerHTML = isTilted ? '2D' : '3D';
    });
    
    return controlUI;
  };
  
  // Handle Google Maps API errors
  useEffect(() => {
    if (isError && loadingError) {
      onError(loadingError);
    }
  }, [isError, loadingError, onError]);
  
  return (
    <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2 relative bg-gradient-to-b from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{
          touchAction: 'pan-x pan-y',
          willChange: 'transform' // Ottimizza le performance durante le trasformazioni
        }}
      />
      {!mapLoaded && <LoadingIndicator />}
    </div>
  );
};

export default JavaScriptMap;
