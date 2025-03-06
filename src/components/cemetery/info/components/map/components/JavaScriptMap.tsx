
import React from "react";
import LoadingIndicator from "./LoadingIndicator";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";
import useMapInitialization from "../hooks/useMapInitialization";

interface JavaScriptMapProps {
  cemetery: any;
  forceRefresh: number;
  onError: (error: string) => void;
}

const JavaScriptMap: React.FC<JavaScriptMapProps> = ({ cemetery, forceRefresh, onError }) => {
  const { isLoaded, isError, loadingError } = useGoogleMapsApi();
  const { mapRef, mapLoaded } = useMapInitialization({
    isLoaded,
    cemetery,
    forceRefresh,
    onError
  });
  
  // Handle Google Maps API errors
  React.useEffect(() => {
    if (isError && loadingError) {
      onError(loadingError);
    }
  }, [isError, loadingError, onError]);
  
  return (
    <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2 relative bg-gradient-to-b from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{
          touchAction: 'pan-x pan-y',
          willChange: 'transform' // Optimize performance during transformations
        }}
      />
      {!mapLoaded && <LoadingIndicator />}
    </div>
  );
};

export default JavaScriptMap;
