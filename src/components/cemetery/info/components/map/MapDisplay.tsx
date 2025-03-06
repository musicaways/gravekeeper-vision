
import React, { useEffect, useState, useRef } from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openExternalMap } from "./mapUtils";

interface MapDisplayProps {
  loading: boolean;
  mapUrl: string | null;
  apiKeyError: boolean;
  cemetery: any;
  useCustomMap: boolean;
  customMapId: string;
  hasCustomMapMarker?: boolean;
  getCleanMarkerId?: () => string | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  loading,
  mapUrl,
  apiKeyError,
  cemetery,
  useCustomMap,
  customMapId,
}) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  useEffect(() => {
    // Reset iframe loaded state when map URL changes
    setIframeLoaded(false);
  }, [mapUrl]);

  // Handle iframe loaded event
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    console.log("Map iframe loaded successfully");
  };

  const handleOpenMapInNewTab = () => {
    console.log("Opening map in new tab");
    openExternalMap(customMapId, useCustomMap, cemetery);
  };

  // Function to reload the iframe with updated URL
  const reloadMap = () => {
    console.log("Reloading map iframe");
    setForceRefresh(prev => prev + 1);
    setIframeLoaded(false);
    toast.success("Mappa aggiornata");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="ml-2">Caricamento mappa...</span>
      </div>
    );
  }

  if (apiKeyError) {
    console.log("Showing API key error state");
    return (
      <div className="text-center py-6 bg-muted/30 rounded-md">
        <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground mb-2">API key di Google Maps non configurata correttamente</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = '/settings'}
          className="text-xs"
        >
          Configura nelle impostazioni
        </Button>
      </div>
    );
  }

  if (!mapUrl) {
    console.log("No map URL available");
    return (
      <div className="text-center py-6 bg-muted/30 rounded-md">
        <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground mb-2">Posizione non disponibile per questo cimitero</p>
      </div>
    );
  }

  // Add the refresh parameter to force iframe reload
  const mapUrlWithParams = `${mapUrl}${mapUrl.includes('?') ? '&' : '?'}refresh=${forceRefresh}`;

  console.log("Rendering map with URL:", mapUrlWithParams);
  return (
    <div className="space-y-2">
      <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2 relative">
        <iframe 
          ref={iframeRef}
          src={mapUrlWithParams}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Mappa del cimitero"
          onLoad={handleIframeLoad}
          onError={(e) => {
            console.error("Map iframe loading error:", e);
            toast.error("Errore nel caricamento della mappa: API key non valida");
          }}
        ></iframe>
        
        {/* Loading overlay */}
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-t-primary border-primary/30 rounded-full animate-spin"></div>
              <p className="mt-4 text-sm">Caricamento mappa in corso...</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={reloadMap}
          className="text-xs flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-refresh-cw"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Aggiorna mappa
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOpenMapInNewTab}
          className="flex items-center gap-1 text-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-navigation"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Apri in Google Maps
        </Button>
      </div>
      
      <div className="mt-2 bg-blue-50 border border-blue-200 p-3 rounded-md text-sm">
        <p className="text-blue-800">
          <strong>Info:</strong> Per modificare la posizione del cimitero sulla mappa, inserisci le coordinate geografiche
          (latitudine e longitudine) o l'indirizzo completo nella schermata di modifica.
        </p>
      </div>
    </div>
  );
};

export default MapDisplay;
