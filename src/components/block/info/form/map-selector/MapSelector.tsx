
import React from "react";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";
import { MapContainer, PositionConfirmation } from "./components";
import { useMapSelector } from "./hooks/useMapSelector";

interface MapSelectorProps {
  onSelectLocation: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const MapSelector: React.FC<MapSelectorProps> = ({ 
  onSelectLocation,
  initialLat = 41.9028,
  initialLng = 12.4964
}) => {
  const { isError, loadingError } = useGoogleMapsApi();
  const { 
    mapRef, 
    selectedPosition, 
    handleConfirm, 
    initializeMarker,
    setMarker,
    setSelectedPosition
  } = useMapSelector({
    initialLat,
    initialLng,
    onSelectLocation
  });
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex-1 rounded-md mb-4">
        <MapContainer
          mapRef={mapRef}
          initialLat={initialLat}
          initialLng={initialLng}
          initializeMarker={initializeMarker}
          setMarker={setMarker}
          setSelectedPosition={setSelectedPosition}
        />
      </div>
      
      <PositionConfirmation
        selectedPosition={selectedPosition}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default MapSelector;
