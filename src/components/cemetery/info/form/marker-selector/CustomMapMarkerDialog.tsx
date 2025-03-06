
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Map } from "lucide-react";
import { useCustomMapMarker } from "./hooks/useCustomMapMarker";
import InstructionsPanel from "./components/InstructionsPanel";
import MapContainer from "./components/MapContainer";
import DialogFooter from "./components/DialogFooter";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomMapMarkerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (markerId: string) => void;
  customMapId: string;
  initialMarkerId?: string;
  cemeteryCoordinates?: {
    latitude: number | null;
    longitude: number | null;
  };
}

const CustomMapMarkerDialog = ({
  open,
  onClose,
  onSelect,
  customMapId,
  initialMarkerId,
  cemeteryCoordinates
}: CustomMapMarkerDialogProps) => {
  const isMobile = useIsMobile();
  const {
    mapLoaded,
    showInstructions,
    selectedMarkerId,
    mapError,
    mapUrl,
    iframeRef,
    setShowInstructions,
    handleIframeLoad,
    handleIframeError,
    confirmSelection,
    handleManualInput,
    handleUrlInput,
    setSelectedMarkerId
  } = useCustomMapMarker({
    initialMarkerId,
    customMapId,
    cemeteryCoordinates,
    onSelect
  });
  
  // Handle confirmation and close dialog
  const handleConfirm = () => {
    const success = confirmSelection();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${isMobile ? 'max-w-full w-full h-[95vh] p-0 rounded-t-xl m-0 bottom-0 top-auto translate-y-0 translate-x-[-50%]' : 'max-w-4xl h-[80vh]'} flex flex-col p-0 gap-0`}>
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Map className="h-4 w-4" />
            Seleziona marker dalla mappa
          </DialogTitle>
          <DialogDescription className="text-xs">
            Clicca su un marker nella mappa o inseriscilo manualmente
          </DialogDescription>
        </DialogHeader>
        
        <InstructionsPanel 
          showInstructions={showInstructions} 
          onHideInstructions={() => setShowInstructions(false)} 
          isMobile={isMobile}
        />
        
        <MapContainer 
          mapUrl={mapUrl}
          mapError={mapError}
          mapLoaded={mapLoaded}
          iframeRef={iframeRef}
          onIframeLoad={handleIframeLoad}
          onIframeError={handleIframeError}
          onManualInput={handleManualInput}
          onUrlInput={handleUrlInput}
          isMobile={isMobile}
        />
        
        <DialogFooter 
          selectedMarkerId={selectedMarkerId}
          onCancel={onClose}
          onConfirm={handleConfirm}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomMapMarkerDialog;
