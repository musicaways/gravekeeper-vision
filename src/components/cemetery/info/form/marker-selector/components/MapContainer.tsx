
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy, Link } from "lucide-react";

interface MapContainerProps {
  mapUrl: string | null;
  mapError: string | null;
  mapLoaded: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onIframeLoad: () => void;
  onIframeError: () => void;
  onManualInput: () => void;
  onUrlInput?: () => void;
}

const MapContainer = ({
  mapUrl,
  mapError,
  mapLoaded,
  iframeRef,
  onIframeLoad,
  onIframeError,
  onManualInput,
  onUrlInput
}: MapContainerProps) => {
  return (
    <div className="flex-1 relative min-h-0">
      {mapError && (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {mapError}
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={onManualInput}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Inserisci ID manualmente
              </Button>
              {onUrlInput && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={onUrlInput}
                >
                  <Link className="h-3.5 w-3.5 mr-1" />
                  Incolla URL
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {mapUrl ? (
        <div className="relative w-full h-full">
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
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 text-black shadow-md hover:bg-white"
              onClick={onManualInput}
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              Inserisci ID
            </Button>
            {onUrlInput && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 text-black shadow-md hover:bg-white"
                onClick={onUrlInput}
              >
                <Link className="h-3.5 w-3.5 mr-1" />
                Incolla URL
              </Button>
            )}
          </div>
        </div>
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
