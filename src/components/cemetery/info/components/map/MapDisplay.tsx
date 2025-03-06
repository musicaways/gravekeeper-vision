
import React, { useState } from "react";
import { useMapDisplay } from "./hooks/useMapDisplay";
import MapLoadingState from "./components/MapLoadingState";
import MapErrorState from "./components/MapErrorState";
import MapControls from "./components/MapControls";
import JavaScriptMap from "./components/JavaScriptMap";
import { openExternalMap } from "./mapUtils";

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
  const {
    forceRefresh,
    mapError,
    showLoadingState,
    showApiKeyError,
    showMapError,
    showNoCoordinatesError,
    showMap,
    handleMapError,
    refreshMap
  } = useMapDisplay({ loading, apiKeyError, cemetery });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoaded = (loadedMap: google.maps.Map) => {
    setMap(loadedMap);
  };

  const handleOpenMapInNewTab = () => {
    console.log("Opening map in new tab");
    openExternalMap(customMapId, false, cemetery);
  };

  if (showLoadingState) {
    return <MapLoadingState />;
  }

  if (showApiKeyError) {
    console.log("Showing API key error state");
    return (
      <MapErrorState 
        message="API key di Google Maps non configurata correttamente" 
        buttonText="Configura nelle impostazioni"
        buttonAction={() => window.location.href = '/settings'}
      />
    );
  }

  if (showMapError) {
    return (
      <MapErrorState 
        message={`Errore nel caricamento della mappa: ${mapError}`}
        buttonText="Riprova"
        buttonAction={refreshMap}
      />
    );
  }

  if (showNoCoordinatesError) {
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
        onError={handleMapError}
        onMapLoaded={handleMapLoaded}
      />
      
      <div className="flex justify-start mt-3">
        <MapControls 
          onOpenInGoogleMaps={handleOpenMapInNewTab}
          map={map}
        />
      </div>
    </div>
  );
};

export default MapDisplay;
