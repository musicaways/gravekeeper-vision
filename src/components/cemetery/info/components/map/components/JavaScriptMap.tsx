
import React, { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LoadingIndicator from "./LoadingIndicator";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";

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
  
  // Configurazione della mappa
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;
    
    try {
      const { Latitudine, Longitudine } = cemetery;
      
      // Verifica se ci sono coordinate valide
      if (!Latitudine || !Longitudine) {
        onError("Coordinate non disponibili per questo cimitero");
        return;
      }
      
      const mapPosition = { 
        lat: parseFloat(Latitudine), 
        lng: parseFloat(Longitudine) 
      };
      
      // Opzioni della mappa personalizzate
      const mapOptions: google.maps.MapOptions = {
        center: mapPosition,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        disableDefaultUI: true, // Nasconde tutti i controlli UI di default
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy', // Abilita pan con singolo dito
        clickableIcons: false, // Disabilita POI cliccabili
        scrollwheel: true, // Abilita zoom con rotella mouse
        styles: [
          {
            // Nasconde POI e landmarks
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            // Nasconde edifici 3D
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }]
          },
          {
            // Stile per strade
            featureType: 'road',
            elementType: 'all',
            stylers: [{ saturation: -100 }, { lightness: 45 }]
          },
          {
            // Stile per etichette di strade
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'simplified' }]
          },
          {
            // Nasconde controlli
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };
      
      // Inizializza la mappa
      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      
      // Aggiungi marker personalizzato
      const newMarker = new window.google.maps.Marker({
        position: mapPosition,
        map: newMap,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3b82f6', // colore primary
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: cemetery.Nome || 'Cimitero'
      });
      
      // Salva riferimenti
      setMap(newMap);
      setMarker(newMarker);
      setMapLoaded(true);
      
      // Aggiungi listener per eventuali errori della mappa
      const errorListener = newMap.addListener('error', () => {
        onError("Errore durante il caricamento della mappa");
      });
      
      return () => {
        // Pulizia listener quando il componente viene smontato
        if (errorListener) {
          google.maps.event.removeListener(errorListener);
        }
      };
    } catch (error) {
      console.error("Errore nell'inizializzazione della mappa:", error);
      onError(error instanceof Error ? error.message : "Errore sconosciuto");
    }
  }, [isLoaded, cemetery, forceRefresh, onError]);
  
  // Gestisci errori API Google Maps
  useEffect(() => {
    if (isError && loadingError) {
      onError(loadingError);
    }
  }, [isError, loadingError, onError]);
  
  // Se l'API Google Maps non è ancora caricata
  if (!isLoaded) {
    return <LoadingIndicator />;
  }
  
  return (
    <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2 relative">
      <div 
        ref={mapRef} 
        className="w-full h-full"
      />
      {!mapLoaded && <LoadingIndicator />}
    </div>
  );
};

export default JavaScriptMap;
