
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import MapIframe from "./components/MapIframe";
import MapErrorState from "./components/MapErrorState";
import MapControls from "./components/MapControls";
import { openExternalMap } from "./mapUtils";
import JavaScriptMap from "./components/JavaScriptMap";

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
  const [mapError, setMapError] = useState<string | null>(null);
  const [useJavaScriptAPI, setUseJavaScriptAPI] = useState(true);

  // Reset map error when mapUrl changes
  useEffect(() => {
    setMapError(null);
  }, [mapUrl]);

  const handleOpenMapInNewTab = () => {
    console.log("Opening map in new tab");
    openExternalMap(customMapId, useCustomMap, cemetery);
  };

  const reloadMap = () => {
    console.log("Reloading map");
    setForceRefresh(prev => prev + 1);
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
      <MapErrorState 
        message="API key di Google Maps non configurata correttamente" 
        buttonText="Configura nelle impostazioni"
        buttonAction={() => window.location.href = '/settings'}
      />
    );
  }

  if (mapError) {
    return (
      <MapErrorState 
        message={`Errore nel caricamento della mappa: ${mapError}`}
        buttonText="Riprova"
        buttonAction={reloadMap}
      />
    );
  }

  if (!mapUrl && !cemetery?.Latitudine && !cemetery?.Longitudine) {
    console.log("No map URL or coordinates available");
    return (
      <MapErrorState message="Posizione non disponibile per questo cimitero" />
    );
  }

  return (
    <div className="space-y-2">
      {useJavaScriptAPI ? (
        <JavaScriptMap 
          cemetery={cemetery}
          forceRefresh={forceRefresh}
          onError={(error) => setMapError(error)}
        />
      ) : (
        <MapIframe 
          mapUrl={mapUrl || ''} 
          forceRefresh={forceRefresh} 
        />
      )}
      
      <div className="flex justify-between">
        <MapControls 
          onOpenInGoogleMaps={handleOpenMapInNewTab} 
        />
        
        <button 
          onClick={() => setUseJavaScriptAPI(!useJavaScriptAPI)}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {useJavaScriptAPI ? "Passa a mappa iframe" : "Passa a mappa interattiva"}
        </button>
      </div>
    </div>
  );
};

export default MapDisplay;
