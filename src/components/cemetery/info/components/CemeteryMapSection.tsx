
import React from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapDisplay from "./map/MapDisplay";
import { useCemeteryMap } from "./map/useCemeteryMap";

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
    customMapId
  } = useCemeteryMap(cemeteryId);

  const toggleMapType = () => {
    setUseCustomMap(!useCustomMap);
    console.log(`Switched to ${!useCustomMap ? 'custom' : 'standard'} map view`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Map className="h-5 w-5 text-primary mr-2.5" />
          <h3 className="text-base font-medium text-foreground">Mappa del cimitero</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMapType}
          className="text-xs"
        >
          {useCustomMap ? "Visualizza mappa standard" : "Visualizza mappa personalizzata"}
        </Button>
      </div>
      
      <MapDisplay
        loading={loading}
        mapUrl={mapUrl}
        apiKeyError={apiKeyError}
        cemetery={cemetery}
        useCustomMap={useCustomMap}
        customMapId={customMapId}
      />
    </div>
  );
};

export default CemeteryMapSection;
