
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface MapContainerProps {
  mapUrl: string | null;
  mapError: string | null;
  mapLoaded: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onIframeLoad: () => void;
  onIframeError: () => void;
  onManualInput: () => void;
}

const MapContainer = ({
  mapUrl,
  mapError,
  mapLoaded,
  iframeRef,
  onIframeLoad,
  onIframeError,
  onManualInput
}: MapContainerProps) => {
  return (
    <div className="flex-1 relative min-h-0">
      {mapError && (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {mapError}
            <Button
              variant="link"
              className="ml-2 p-0 h-auto text-destructive-foreground underline"
              onClick={onManualInput}
            >
              Inserisci ID manualmente
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {mapUrl ? (
        <iframe 
          ref={iframeRef}
          src={mapUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Seleziona un marker dalla mappa"
          onLoad={onIframeLoad}
          onError={onIframeError}
          className="absolute inset-0"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Nessuna mappa personalizzata configurata</p>
        </div>
      )}
      
      {!mapLoaded && mapUrl && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Caricamento mappa in corso...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
