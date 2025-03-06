
import React, { useEffect } from "react";
import { Map } from "lucide-react";
import MapDisplay from "./map/MapDisplay";
import { useCemeteryMap } from "./map/useCemeteryMap";
import { toast } from "sonner";

interface CemeteryMapSectionProps {
  cemeteryId: string | number;
}

const CemeteryMapSection = ({ cemeteryId }: CemeteryMapSectionProps) => {
  const {
    loading,
    cemetery,
    mapUrl,
    apiKeyError,
    useCustomMap,
    setUseCustomMap,
    customMapId,
    hasCustomMapMarker,
    getCleanMarkerId
  } = useCemeteryMap(cemeteryId);

  useEffect(() => {
    console.log("CemeteryMapSection - Current state:", { 
      loading, 
      hasMapUrl: !!mapUrl, 
      apiKeyError,
      mapUrl
    });
  }, [loading, mapUrl, apiKeyError]);

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
        mapUrl={mapUrl}
        apiKeyError={apiKeyError}
        cemetery={cemetery}
        useCustomMap={useCustomMap}
        customMapId={customMapId}
        hasCustomMapMarker={hasCustomMapMarker}
        getCleanMarkerId={getCleanMarkerId}
      />
    </div>
  );
};

export default CemeteryMapSection;
