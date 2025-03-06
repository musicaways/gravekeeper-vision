
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LightboxControls from "./LightboxControls";
import LightboxNavigation from "./LightboxNavigation";
import LightboxImage from "./LightboxImage";
import LightboxInfoBar from "./LightboxInfoBar";
import SwipeIndicator from "./SwipeIndicator";
import DeletePhotoDialog from "./DeletePhotoDialog";
import { useImageLightbox } from "./useImageLightbox";
import { ImageLightboxProps } from "./types";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtendedImageLightboxProps extends ImageLightboxProps {
  onDeletePhoto?: (photoId: string) => Promise<void>;
}

const ImageLightbox = ({ 
  images, 
  open, 
  initialIndex, 
  onClose,
  onDeletePhoto
}: ExtendedImageLightboxProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    currentIndex,
    scale,
    position,
    showControls,
    dragging,
    swipeDirection,
    imageRef,
    contentRef,
    goToPreviousImage,
    goToNextImage,
    handleZoomIn,
    handleZoomOut,
    toggleControls,
    handleImageClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentImage,
    parseImageDetails,
    setScale
  } = useImageLightbox({ images, open, initialIndex, onClose });

  const handleDeleteRequest = () => {
    if (onDeletePhoto) {
      setDeleteDialogOpen(true);
    } else {
      toast({
        title: "Operazione non disponibile",
        description: "La funzione di eliminazione non è disponibile in questa galleria.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDeletePhoto || !currentImage?.id) return;
    
    try {
      setIsDeleting(true);
      await onDeletePhoto(currentImage.id);
      
      toast({
        title: "Foto eliminata",
        description: "La foto è stata eliminata con successo.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione della foto.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (images.length === 0 || !open) return null;

  const { title, description, dateInfo } = parseImageDetails();
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95 touch-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-modal="true"
          role="dialog"
          aria-label="Visualizzatore immagini"
          aria-describedby="lightbox-description"
        >
          <span id="lightbox-description" className="sr-only">Visualizzatore immagini a schermo intero</span>
          
          {/* Close button - always visible */}
          <button 
            className="absolute right-4 top-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
            onClick={onClose}
            aria-label="Chiudi visualizzatore"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div 
            className="w-full h-full flex flex-col overflow-hidden touch-none"
            ref={contentRef}
          >
            <div 
              className="relative w-full h-full flex items-center justify-center touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={handleImageClick}
            >
              {/* Top controls bar */}
              <LightboxControls 
                showControls={showControls}
                currentIndex={currentIndex}
                imagesLength={images.length}
                scale={scale}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                onClose={onClose}
                onDeleteRequest={handleDeleteRequest}
              />
              
              {/* Navigation buttons */}
              <LightboxNavigation 
                showControls={showControls}
                scale={scale}
                goToPreviousImage={goToPreviousImage}
                goToNextImage={goToNextImage}
              />
              
              {/* Image */}
              <LightboxImage 
                imageRef={imageRef}
                currentImage={currentImage}
                title={title}
                scale={scale}
                position={position}
                dragging={dragging}
                swipeDirection={swipeDirection}
                setScale={setScale}
              />
              
              {/* Bottom info bar */}
              <LightboxInfoBar 
                showControls={showControls}
                title={title}
                description={description}
                dateInfo={dateInfo}
              />
              
              {/* Swipe indicator */}
              {swipeDirection && (
                <SwipeIndicator direction={swipeDirection} />
              )}
            </div>
          </div>
          
          <DeletePhotoDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            photoTitle={title}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
