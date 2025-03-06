
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
        buttonAction={() => setForceRefresh(prev => prev + 1)}
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
      
      <div className="flex justify-start mt-3">
        <MapControls 
          onOpenInGoogleMaps={handleOpenMapInNewTab} 
        />
      </div>
    </div>
  );
};

export default MapDisplay;
