
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import MapIframe from "./components/MapIframe";
import MapErrorState from "./components/MapErrorState";
import MapControls from "./components/MapControls";
import MapInfoBox from "./components/MapInfoBox";
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
  const [mapError, setMapError] = useState<string | null>(null);

  // Reset map error when mapUrl changes
  useEffect(() => {
    setMapError(null);
  }, [mapUrl]);

  const handleOpenMapInNewTab = () => {
    console.log("Opening map in new tab");
    openExternalMap(customMapId, useCustomMap, cemetery);
  };

  const reloadMap = () => {
    console.log("Reloading map iframe");
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

  if (!mapUrl) {
    console.log("No map URL available");
    return (
      <MapErrorState message="Posizione non disponibile per questo cimitero" />
    );
  }

  console.log("Rendering map with URL:", mapUrl);
  return (
    <div className="space-y-2">
      <MapIframe 
        mapUrl={mapUrl} 
        forceRefresh={forceRefresh} 
      />
      <MapControls 
        onRefresh={reloadMap} 
        onOpenInGoogleMaps={handleOpenMapInNewTab} 
      />
      <MapInfoBox />
    </div>
  );
};

export default MapDisplay;
