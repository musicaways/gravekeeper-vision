
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Photo {
  Id: string;
  Url: string;
  NomeFile?: string;
  Descrizione?: string;
}

interface CemeteryGalleryProps {
  photos: Photo[];
}

const CemeteryGallery = ({ photos }: CemeteryGalleryProps) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setOpen(true);
  };

  const closeLightbox = () => {
    setOpen(false);
  };

  const goToPreviousPhoto = () => {
    if (selectedPhotoIndex === null) return;
    const newIndex = selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1;
    setSelectedPhotoIndex(newIndex);
  };

  const goToNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    const newIndex = selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1;
    setSelectedPhotoIndex(newIndex);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div 
            key={photo.Id} 
            className="aspect-square relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(index)}
          >
            <img 
              src={photo.Url} 
              alt={photo.Descrizione || `Foto ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            {photo.Descrizione && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                {photo.Descrizione}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 flex flex-col">
          <div className="relative h-full flex flex-col">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeLightbox}
              className="absolute top-2 right-2 z-10"
            >
              <X className="h-6 w-6" />
            </Button>
            
            {selectedPhotoIndex !== null && (
              <div className="relative w-full h-full flex-1 flex items-center justify-center bg-black/90 p-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousPhoto();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-black/30"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <img 
                  src={photos[selectedPhotoIndex]?.Url} 
                  alt={photos[selectedPhotoIndex]?.Descrizione || `Foto ${selectedPhotoIndex + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextPhoto();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-black/30"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            )}
            
            {selectedPhotoIndex !== null && photos[selectedPhotoIndex]?.Descrizione && (
              <div className="p-4 bg-background">
                <p className="text-lg font-medium">{photos[selectedPhotoIndex].Descrizione}</p>
                {photos[selectedPhotoIndex].NomeFile && (
                  <p className="text-sm text-muted-foreground">{photos[selectedPhotoIndex].NomeFile}</p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CemeteryGallery;
