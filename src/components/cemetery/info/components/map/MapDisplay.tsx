
import React, { useEffect, useState, useRef } from "react";
import { Map, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { openExternalMap } from "./mapUtils";
import { Badge } from "@/components/ui/badge";

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
  hasCustomMapMarker = false,
  getCleanMarkerId
}) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [highlightActive, setHighlightActive] = useState(false);
  
  // Get the clean marker ID
  const cleanMarkerId = getCleanMarkerId?.() || null;
  
  useEffect(() => {
    console.log("MapDisplay rendered with:", { 
      loading, 
      hasMapUrl: !!mapUrl, 
      apiKeyError, 
      useCustomMap, 
      hasCustomMapMarker,
      customMarkerId: cleanMarkerId || cemetery?.custom_map_marker_id,
      mapUrl 
    });
    
    // Reset iframe loaded state when map URL changes
    setIframeLoaded(false);
  }, [loading, mapUrl, apiKeyError, useCustomMap, hasCustomMapMarker, cemetery, cleanMarkerId]);

  // Handle iframe loaded event
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    console.log("Map iframe loaded successfully");
    
    // If we have a custom map with marker, try to highlight the marker
    if (useCustomMap && hasCustomMapMarker && iframeRef.current) {
      setTimeout(() => {
        setHighlightActive(true);
        console.log("Marker highlight activated");
      }, 1500);
    }
  };

  const handleOpenMapInNewTab = () => {
    console.log("Opening map in new tab");
    openExternalMap(customMapId, useCustomMap, cemetery);
  };

  // Function to reload the iframe with updated URL
  const reloadMap = () => {
    console.log("Reloading map iframe to refresh marker view");
    setForceRefresh(prev => prev + 1);
    setHighlightActive(false);
    
    // Reset iframe loaded state
    setIframeLoaded(false);
    
    // Re-activate highlight after a delay
    setTimeout(() => {
      setHighlightActive(true);
      console.log("Marker highlight reactivated after reload");
    }, 2000);
    
    toast.success("Mappa aggiornata. Il marker dovrebbe essere visibile ed evidenziato.");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="ml-2">Caricamento mappa...</span>
      </div>
    );
  }

  if (apiKeyError && !useCustomMap) {
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
  // For custom maps with markers, ensure we include msid and z=18 parameters
  let mapUrlWithParams = mapUrl;
  
  // Ensure the URL has the necessary parameters
  if (useCustomMap && hasCustomMapMarker && cleanMarkerId) {
    // Parse the URL to ensure it has all needed parameters
    const url = new URL(mapUrl.startsWith('http') ? mapUrl : `https:${mapUrl}`);
    
    // Make sure the msid parameter is set correctly
    url.searchParams.set('msid', cleanMarkerId);
    
    // Set zoom to 18 for a closer view of the marker
    url.searchParams.set('z', '18');
    
    // Add a refresh parameter to force reload
    url.searchParams.set('refresh', forceRefresh.toString());
    
    mapUrlWithParams = url.toString();
    console.log("Enhanced map URL with markers:", mapUrlWithParams);
  } else {
    // For other maps, just add the refresh parameter
    mapUrlWithParams = `${mapUrl}${mapUrl.includes('?') ? '&' : '?'}refresh=${forceRefresh}`;
  }

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
            if (!useCustomMap) {
              toast.error("Errore nel caricamento della mappa: API key non valida");
            } else {
              toast.error("Errore nel caricamento della mappa personalizzata");
            }
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
        
        {/* Indicatore del marker selezionato */}
        {useCustomMap && hasCustomMapMarker && iframeLoaded && (
          <div className="absolute top-2 left-2 right-2 flex flex-col items-center">
            <Badge 
              className={`${highlightActive ? 'bg-primary animate-pulse' : 'bg-primary/80'} text-white px-3 py-1 text-sm shadow-lg`}
            >
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
              Marker selezionato attivo
            </Badge>
            
            {/* Pulsante per centrare sul marker */}
            <Button
              variant="secondary"
              size="sm"
              onClick={reloadMap}
              className="text-xs mt-2 bg-white/90 text-black shadow-md hover:bg-white"
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
                className="mr-1.5"
              >
                <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                <path d="m7.5 4.27 9 5.15" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" x2="12" y1="22" y2="12" />
                <circle cx="18.5" cy="15.5" r="2.5" />
                <path d="M20.27 17.27 22 19" />
              </svg>
              Centra sul marker
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        {useCustomMap && hasCustomMapMarker && (
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
        )}
        <div className={useCustomMap && hasCustomMapMarker ? "ml-auto" : ""}>
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
            {useCustomMap ? "Apri mappa personalizzata" : "Apri in Google Maps"}
          </Button>
        </div>
      </div>
      
      {useCustomMap && !hasCustomMapMarker && cemetery?.Latitudine && cemetery?.Longitudine && (
        <div className="mt-2 bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 font-medium">Marker non configurato</p>
              <p className="text-yellow-700 mt-1">
                La mappa personalizzata è centrata sul cimitero, ma non è stato configurato un marker specifico. 
                Per visualizzare un marker sulla mappa personalizzata, aggiungi l'ID del marker nelle impostazioni del cimitero.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {useCustomMap && hasCustomMapMarker && (
        <div className="mt-2 bg-green-50 border border-green-200 p-3 rounded-md text-sm">
          <p className="text-green-800">
            <strong>Marker configurato:</strong> La mappa personalizzata visualizza il marker associato a questo cimitero.
            Se il marker non è visibile, prova a utilizzare il pulsante "Centra sul marker" o "Aggiorna mappa".
          </p>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
