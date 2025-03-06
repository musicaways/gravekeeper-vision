
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import MapErrorState from "./components/MapErrorState";
import MapControls from "./components/MapControls";
import { openExternalMap } from "./mapUtils";
import JavaScriptMap from "./components/JavaScriptMap";

interface MapDisplayProps {
  loading: boolean;
  apiKeyError: boolean;
  cemetery: any;
  customMapId: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  loading,
  apiKeyError,
  cemetery,
  customMapId,
}) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const [mapError, setMapError] = useState<string | null>(null);

  // Reset map error when cemetery changes
  useEffect(() => {
    setMapError(null);
  }, [cemetery]);

  const handleOpenMapInNewTab = () => {
    console.log("Opening map in new tab");
    openExternalMap(customMapId, false, cemetery);
  };

  const reloadMap = () => {
    console.log("Reloading map");
    setForceRefresh(prev => prev + 1);
    toast.success("Mappa aggiornata");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="h-8 w-8 rounded-full border-2 border-t-primary border-primary/30 animate-spin"></div>
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

  if (!cemetery?.Latitudine && !cemetery?.Longitudine) {
    console.log("No coordinates available");
    return (
      <MapErrorState message="Posizione non disponibile per questo cimitero" />
    );
  }

  return (
    <div className="space-y-2">
      <JavaScriptMap 
        cemetery={cemetery}
        forceRefresh={forceRefresh}
        onError={(error) => setMapError(error)}
      />
      
      <div className="flex justify-between">
        <MapControls 
          onOpenInGoogleMaps={handleOpenMapInNewTab} 
        />
        
        <button 
          onClick={reloadMap}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          Aggiorna mappa
        </button>
      </div>
    </div>
  );
};

export default MapDisplay;
