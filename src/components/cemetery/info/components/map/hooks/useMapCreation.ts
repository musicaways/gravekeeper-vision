
import { useEffect } from "react";
import { getMapOptions } from "../utils/mapStyles";

interface UseMapCreationProps {
  isLoaded: boolean;
  cemetery: any;
  mapRef: React.RefObject<HTMLDivElement>;
  mapInitializedRef: React.MutableRefObject<boolean>;
  setMap: (map: google.maps.Map | null) => void;
  onError: (error: string) => void;
}

export const useMapCreation = ({
  isLoaded,
  cemetery,
  mapRef,
  mapInitializedRef,
  setMap,
  onError
}: UseMapCreationProps) => {
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !cemetery || mapInitializedRef.current) {
      return;
    }

    try {
      // Check for valid coordinates
      const lat = parseFloat(cemetery.Latitudine);
      const lng = parseFloat(cemetery.Longitudine);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Coordinate non valide per questo cimitero");
      }

      console.log("Initializing map with coordinates:", lat, lng);
      
      // Initialize map with custom options
      const mapOptions = getMapOptions({ lat, lng });
      
      const newMap = new window.google.maps.Map(mapRef.current, {
        ...mapOptions,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
        }
      });
      
      // Set the created map
      mapInitializedRef.current = true;
      setMap(newMap);
      
    } catch (error) {
      console.error("Error initializing map:", error);
      onError(error instanceof Error ? error.message : "Errore sconosciuto durante l'inizializzazione della mappa");
    }
  }, [isLoaded, cemetery, mapRef, mapInitializedRef, setMap, onError]);
};
