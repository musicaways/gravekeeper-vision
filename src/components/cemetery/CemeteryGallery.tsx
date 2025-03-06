
import React, { useState } from "react";
import ImageLightbox, { LightboxImage } from "@/components/ui/image-lightbox";
import { CemeteryGalleryProps } from "./photos/types";
import { useCemeteryPhotos } from "./photos/useCemeteryPhotos";
import PhotoGrid from "./photos/PhotoGrid";

const CemeteryGallery: React.FC<CemeteryGalleryProps> = ({ 
  cemeteryId, 
  columns = 3, 
  aspect = "square",
  className = "" 
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const { photos, loading, handleDeletePhoto } = useCemeteryPhotos(cemeteryId);

  const lightboxImages: LightboxImage[] = photos.map(photo => ({
    id: photo.Id,
    url: photo.Url,
    title: photo.NomeFile || "",
    description: photo.Descrizione || "",
    date: photo.DataInserimento || ""
  }));

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className={className}>
      <PhotoGrid 
        photos={photos} 
        loading={loading} 
        columns={columns} 
        aspect={aspect}
        onPhotoClick={openLightbox}
      />

      <ImageLightbox 
        images={lightboxImages}
        open={lightboxOpen}
        initialIndex={selectedPhotoIndex}
        onClose={closeLightbox}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
};

export default CemeteryGallery;
