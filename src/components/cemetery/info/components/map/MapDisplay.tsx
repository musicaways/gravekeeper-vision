
import React, { useEffect } from "react";
import { Map, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { openExternalMap } from "./mapUtils";

interface MapDisplayProps {
  loading: boolean;
  mapUrl: string | null;
  apiKeyError: boolean;
  cemetery: any;
  useCustomMap: boolean;
  customMapId: string;
  hasCustomMapMarker?: boolean;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  loading,
  mapUrl,
  apiKeyError,
  cemetery,
  useCustomMap,
  customMapId,
  hasCustomMapMarker = false
}) => {
  useEffect(() => {
    console.log("MapDisplay rendered with:", { 
      loading, 
      hasMapUrl: !!mapUrl, 
      apiKeyError, 
      useCustomMap, 
      hasCustomMapMarker,
      mapUrl 
    });
  }, [loading, mapUrl, apiKeyError, useCustomMap, hasCustomMapMarker]);

  const handleOpenMapInNewTab = () => {
    console.log("Opening map in new tab");
    openExternalMap(customMapId, useCustomMap, cemetery);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="ml-2">Caricamento mappa...</span>
      </div>
    );
  }

  if (apiKeyError && !useCustomMap) {
    console.log("Showing API key error state");
    return (
      <div className="text-center py-6 bg-muted/30 rounded-md">
        <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground mb-2">API key di Google Maps non configurata correttamente</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = '/settings'}
          className="text-xs"
        >
          Configura nelle impostazioni
        </Button>
      </div>
    );
  }

  if (!mapUrl) {
    console.log("No map URL available");
    return (
      <div className="text-center py-6 bg-muted/30 rounded-md">
        <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground mb-2">Posizione non disponibile per questo cimitero</p>
      </div>
    );
  }

  console.log("Rendering map with URL:", mapUrl);
  return (
    <div className="space-y-2">
      <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2">
        <iframe 
          src={mapUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Mappa del cimitero"
          onError={(e) => {
            console.error("Map iframe loading error:", e);
            if (!useCustomMap) {
              toast.error("Errore nel caricamento della mappa: API key non valida");
            } else {
              toast.error("Errore nel caricamento della mappa personalizzata");
            }
          }}
        ></iframe>
      </div>
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOpenMapInNewTab}
          className="flex items-center gap-1 text-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-navigation"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          {useCustomMap ? "Apri mappa personalizzata" : "Apri in Google Maps"}
        </Button>
      </div>
      
      {useCustomMap && !hasCustomMapMarker && cemetery?.Latitudine && cemetery?.Longitudine && (
        <div className="mt-2 bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 font-medium">Marker non configurato</p>
              <p className="text-yellow-700 mt-1">
                La mappa personalizzata è centrata sul cimitero, ma non è stato configurato un marker specifico. 
                Per visualizzare un marker sulla mappa personalizzata, aggiungi l'ID del marker nelle impostazioni del cimitero.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {useCustomMap && hasCustomMapMarker && (
        <div className="mt-2 bg-green-50 border border-green-200 p-3 rounded-md text-sm">
          <p className="text-green-800">
            <strong>Marker configurato:</strong> La mappa personalizzata visualizza il marker associato a questo cimitero.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
