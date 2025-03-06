
import React, { useEffect } from "react";
import { Map } from "lucide-react";
import MapDisplay from "./map/MapDisplay";
import { useCemeteryMap } from "./map/useCemeteryMap";

interface CemeteryMapSectionProps {
  cemeteryId: string | number;
}

const CemeteryMapSection = ({ cemeteryId }: CemeteryMapSectionProps) => {
  const {
    loading,
    cemetery,
    apiKeyError,
    customMapId
  } = useCemeteryMap(cemeteryId);

  useEffect(() => {
    console.log("CemeteryMapSection - Current state:", { 
      loading, 
      hasCoordinates: !!(cemetery?.Latitudine && cemetery?.Longitudine), 
      apiKeyError
    });
  }, [loading, cemetery, apiKeyError]);

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <div className="flex items-center">
          <Map className="h-5 w-5 text-primary mr-2.5" />
          <h3 className="text-base font-medium text-foreground">Mappa del cimitero</h3>
        </div>
      </div>
      
      <MapDisplay
        loading={loading}
        apiKeyError={apiKeyError}
        cemetery={cemetery}
        customMapId={customMapId}
      />
    </div>
  );
};

export default CemeteryMapSection;
