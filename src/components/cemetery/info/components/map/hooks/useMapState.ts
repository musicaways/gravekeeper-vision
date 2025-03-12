
import { useRef, useState, useEffect } from "react";

interface UseMapStateProps {
  cemetery: any;
  forceRefresh: number;
}

export const useMapState = ({ cemetery, forceRefresh }: UseMapStateProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInitializedRef = useRef(false);

  // Reset when cemetery or forceRefresh changes
  useEffect(() => {
    mapInitializedRef.current = false;
    setMapLoaded(false);
    setMap(null);
  }, [cemetery, forceRefresh]);

  return {
    mapRef,
    map,
    setMap,
    mapLoaded,
    setMapLoaded,
    mapInitializedRef
  };
};
