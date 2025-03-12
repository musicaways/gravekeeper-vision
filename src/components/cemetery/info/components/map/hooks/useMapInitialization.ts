
import { useMapState } from "./useMapState";
import { useMapCreation } from "./useMapCreation";
import { useMapStyling } from "./useMapStyling";
import { useMapMarkers } from "./useMapMarkers";
import { useMapLoadedEvent } from "./useMapLoadedEvent";

interface UseMapInitializationProps {
  isLoaded: boolean;
  cemetery: any;
  forceRefresh: number;
  onError: (error: string) => void;
}

const useMapInitialization = ({
  isLoaded,
  cemetery,
  forceRefresh,
  onError
}: UseMapInitializationProps) => {
  // Manage map state
  const {
    mapRef,
    map,
    setMap,
    mapLoaded,
    setMapLoaded,
    mapInitializedRef
  } = useMapState({ cemetery, forceRefresh });

  // Create the map instance
  useMapCreation({
    isLoaded,
    cemetery,
    mapRef,
    mapInitializedRef,
    setMap,
    onError
  });

  // Apply custom styling to hide Google Maps elements
  useMapStyling();

  // Add markers to the map
  useMapMarkers({ map, cemetery });

  // Handle map loaded event
  useMapLoadedEvent({ map, setMapLoaded });

  return { mapRef, map, mapLoaded };
};

export default useMapInitialization;
