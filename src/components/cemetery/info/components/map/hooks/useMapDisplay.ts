
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UseMapDisplayProps {
  loading: boolean;
  apiKeyError: boolean;
  cemetery: any;
}

export const useMapDisplay = ({ 
  loading, 
  apiKeyError, 
  cemetery 
}: UseMapDisplayProps) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const [mapError, setMapError] = useState<string | null>(null);

  // Reset map error when cemetery changes
  useEffect(() => {
    setMapError(null);
  }, [cemetery]);

  const handleMapError = (error: string) => {
    setMapError(error);
  };

  const refreshMap = () => {
    setForceRefresh(prev => prev + 1);
    setMapError(null);
  };

  const hasCoordinates = Boolean(cemetery?.Latitudine && cemetery?.Longitudine);

  const showLoadingState = loading;
  const showApiKeyError = apiKeyError;
  const showMapError = !loading && !apiKeyError && mapError;
  const showNoCoordinatesError = !loading && !apiKeyError && !mapError && !hasCoordinates;
  const showMap = !loading && !apiKeyError && !mapError && hasCoordinates;

  return {
    forceRefresh,
    mapError,
    hasCoordinates,
    showLoadingState,
    showApiKeyError,
    showMapError,
    showNoCoordinatesError,
    showMap,
    handleMapError,
    refreshMap
  };
};
