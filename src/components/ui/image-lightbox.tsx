
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}

const ImageLightbox = ({ images, open, initialIndex, onClose }: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPreviousImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 flex flex-col">
        <div className="relative h-full flex flex-col">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute top-2 right-2 z-10"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative w-full h-full flex-1 flex items-center justify-center bg-black/90 p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-black/30"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <img 
              src={currentImage.url} 
              alt={currentImage.title || currentImage.description || ''}
              className="max-h-full max-w-full object-contain"
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-black/30"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
          
          {(currentImage.title) && (
            <div className="p-4 bg-background">
              <p className="text-lg font-medium">Nota</p>
              <p className="text-base">{currentImage.title}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
