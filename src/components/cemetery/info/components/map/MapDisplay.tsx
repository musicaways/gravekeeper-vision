
import React from "react";
import { Map } from "lucide-react";
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
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  loading,
  mapUrl,
  apiKeyError,
  cemetery,
  useCustomMap,
  customMapId
}) => {
  const handleOpenMapInNewTab = () => {
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
    return (
      <div className="text-center py-6 bg-muted/30 rounded-md">
        <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground mb-2">Posizione non disponibile per questo cimitero</p>
      </div>
    );
  }

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
          onError={() => {
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
          Apri in Google Maps
        </Button>
      </div>
    </div>
  );
};

export default MapDisplay;
