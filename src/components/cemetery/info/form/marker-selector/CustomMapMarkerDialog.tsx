
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Map, Check } from "lucide-react";
import { toast } from "sonner";
import { mapInteractionScript } from "./mapInteractionScript";

interface CustomMapMarkerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (markerId: string) => void;
  customMapId: string;
  initialMarkerId?: string;
}

const CustomMapMarkerDialog = ({
  open,
  onClose,
  onSelect,
  customMapId,
  initialMarkerId
}: CustomMapMarkerDialogProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Ripristina lo stato iniziale quando il dialogo si apre
  useEffect(() => {
    if (open) {
      setSelectedMarkerId(null);
      setMapLoaded(false);
      setShowInstructions(true);
    }
  }, [open]);

  // Costruisci l'URL della mappa personalizzata
  const mapUrl = customMapId ? 
    `https://www.google.com/maps/d/embed?mid=${customMapId}&ehbc=2E312F` :
    null;

  // Gestisci il messaggio dal frame della mappa
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "markerSelected" && data.markerId) {
          setSelectedMarkerId(data.markerId);
          toast.success("Marker selezionato con successo!");
        }
      } catch (e) {
        // Ignora messaggi non in formato JSON
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Inietta lo script nell'iframe dopo che è stato caricato
  const injectScript = () => {
    setMapLoaded(true);
    
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const iframeWindow = iframeRef.current.contentWindow;
        const script = document.createElement('script');
        script.textContent = mapInteractionScript;
        iframeWindow.document.body.appendChild(script);
        
        console.log('Script iniettato nell\'iframe della mappa');
      } catch (error) {
        console.error('Errore durante l\'iniezione dello script:', error);
        toast.error("Impossibile interagire con la mappa a causa di restrizioni di sicurezza");
      }
    }
  };

  // Funzione per confermare la selezione
  const confirmSelection = () => {
    if (selectedMarkerId) {
      onSelect(selectedMarkerId);
      onClose();
    } else {
      toast.error("Seleziona prima un marker dalla mappa");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Seleziona marker dalla mappa personalizzata
          </DialogTitle>
          <DialogDescription>
            Clicca su un marker nella mappa per selezionarlo e collegarlo a questo cimitero
          </DialogDescription>
        </DialogHeader>
        
        {showInstructions && (
          <div className="bg-muted/30 p-4">
            <div className="flex items-start space-x-2">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md w-full">
                <h4 className="font-medium text-amber-900 mb-2">Istruzioni per la selezione</h4>
                <ol className="list-decimal pl-5 space-y-1 text-amber-800">
                  <li>Naviga sulla mappa fino a trovare il marker desiderato</li>
                  <li>Clicca sul marker per selezionarlo</li>
                  <li>Il marker selezionato verrà evidenziato e le sue informazioni appariranno</li>
                  <li>Clicca su "Conferma selezione" per utilizzare questo marker</li>
                </ol>
                <p className="mt-2 text-amber-800 text-sm">
                  <strong>Nota:</strong> A causa delle restrizioni di sicurezza di Google Maps, potrebbe essere necessario 
                  selezionare il marker, copiare manualmente l'ID dalla barra degli indirizzi e incollarlo nel campo.
                </p>
                <div className="mt-3 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowInstructions(false)}
                  >
                    Nascondi istruzioni
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 relative min-h-0">
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
              onLoad={injectScript}
              className="absolute inset-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Nessuna mappa personalizzata configurata</p>
            </div>
          )}
          
          {!mapLoaded && mapUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Caricamento mappa in corso...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm">
            {selectedMarkerId ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Check className="h-4 w-4" /> Marker selezionato
              </span>
            ) : (
              <span className="text-muted-foreground">Nessun marker selezionato</span>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" /> Annulla
            </Button>
            <Button 
              onClick={confirmSelection} 
              disabled={!selectedMarkerId}
            >
              <Check className="h-4 w-4 mr-2" /> Conferma selezione
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomMapMarkerDialog;
