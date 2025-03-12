
import { useEffect } from "react";

interface UseMapLoadedEventProps {
  map: google.maps.Map | null;
  setMapLoaded: (loaded: boolean) => void;
}

export const useMapLoadedEvent = ({
  map,
  setMapLoaded
}: UseMapLoadedEventProps) => {
  useEffect(() => {
    if (!map) {
      return;
    }
    
    // Add event listener for when the map is fully loaded
    const mapLoadedListener = google.maps.event.addListener(map, 'idle', () => {
      console.log("Map fully loaded");
      setMapLoaded(true);
    });
    
    // Clean up event listener when component unmounts
    return () => {
      if (mapLoadedListener) {
        google.maps.event.removeListener(mapLoadedListener);
      }
    };
  }, [map, setMapLoaded]);
};
