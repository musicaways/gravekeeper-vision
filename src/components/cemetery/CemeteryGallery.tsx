
import { useState } from "react";
import ImageLightbox, { LightboxImage } from "@/components/ui/image-lightbox";

interface Photo {
  Id: string;
  Url: string;
  NomeFile?: string;
  Descrizione?: string;
}

interface CemeteryGalleryProps {
  photos: Photo[];
  columns?: 1 | 2 | 3 | 4;
  aspect?: "square" | "video" | "wide";
  className?: string;
}

const CemeteryGallery = ({ 
  photos, 
  columns = 3, 
  aspect = "square",
  className = "" 
}: CemeteryGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  // Transform the cemetery photos to the lightbox format
  const lightboxImages: LightboxImage[] = photos.map(photo => ({
    id: photo.Id,
    url: photo.Url,
    title: photo.Descrizione,
    description: photo.NomeFile
  }));

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Get the grid columns class based on the columns prop
  const getGridClass = () => {
    switch (columns) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 3: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      default: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    }
  };

  // Get the aspect ratio class
  const getAspectClass = () => {
    switch (aspect) {
      case "square": return "aspect-square";
      case "video": return "aspect-video";
      case "wide": return "aspect-[16/9]";
      default: return "aspect-square";
    }
  };

  return (
    <div className={className}>
      <div className={`grid ${getGridClass()} gap-4`}>
        {photos.map((photo, index) => (
          <div 
            key={photo.Id} 
            className={`${getAspectClass()} relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity`}
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

      <ImageLightbox 
        images={lightboxImages}
        open={lightboxOpen}
        initialIndex={selectedPhotoIndex}
        onClose={closeLightbox}
      />
    </div>
  );
};

export default CemeteryGallery;
