
import { useEffect } from "react";
import { createCemeteryMarker } from "../utils/markerUtils";

interface UseMapMarkersProps {
  map: google.maps.Map | null;
  cemetery: any;
}

export const useMapMarkers = ({
  map,
  cemetery
}: UseMapMarkersProps) => {
  useEffect(() => {
    if (!map || !cemetery) {
      return;
    }

    // Create cemetery marker
    const marker = createCemeteryMarker(map, cemetery);
    
    // Clean up marker when component unmounts or dependencies change
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [map, cemetery]);
};
