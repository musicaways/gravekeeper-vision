
import React, { useEffect } from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    hasCustomMapMarker
  } = useCemeteryMap(cemeteryId);

  useEffect(() => {
    console.log("CemeteryMapSection - Current state:", { 
      loading, 
      hasMapUrl: !!mapUrl, 
      apiKeyError, 
      useCustomMap, 
      customMapId,
      hasCustomMapMarker,
      mapUrl
    });
  }, [loading, mapUrl, apiKeyError, useCustomMap, customMapId, hasCustomMapMarker]);
  
  const toggleMapType = () => {
    console.log(`Switching map view from ${useCustomMap ? 'custom' : 'standard'} to ${!useCustomMap ? 'custom' : 'standard'}`);
    
    if (!useCustomMap) {
      // Switching to custom map - inform user about custom maps
      if (cemetery?.custom_map_marker_id) {
        toast.success(
          "Visualizzazione mappa personalizzata con marker configurato",
          { duration: 3000 }
        );
      } else {
        toast.info(
          "La mappa personalizzata mostra la vista dell'area. Per visualizzare un marker specifico, configura l'ID del marker nelle impostazioni.",
          { duration: 4000 }
        );
      }
    }
    
    setUseCustomMap(!useCustomMap);
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
        hasCustomMapMarker={hasCustomMapMarker}
      />
    </div>
  );
};

export default CemeteryMapSection;
