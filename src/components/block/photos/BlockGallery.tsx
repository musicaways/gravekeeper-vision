
import React, { useState } from "react";
import { useBlockPhotos } from "./useBlockPhotos";
import GalleryEmptyState from "./GalleryEmptyState";
import GalleryLoading from "./GalleryLoading";
import PhotoGrid from "./PhotoGrid";
import ImageLightbox from "@/components/ui/image-lightbox";
import { cn } from "@/lib/utils";

interface BlockGalleryProps {
  blockId: string;
  columns?: 1 | 2 | 3 | 4;
  aspect?: "square" | "video" | "wide";
  className?: string;
}

const BlockGallery: React.FC<BlockGalleryProps> = ({ 
  blockId,
  columns = 3,
  aspect = "square",
  className
}) => {
  const { photos, loading, refetch, deletePhoto } = useBlockPhotos(blockId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handlePhotoDelete = async (photoId: string) => {
    const success = await deletePhoto(photoId);
    if (success) {
      setLightboxOpen(false);
    }
    return success;
  };

  // Transform the photos for the lightbox
  const lightboxImages = photos.map(photo => ({
    src: photo.Url,
    alt: photo.Descrizione || "Foto",
    id: photo.Id,
    title: photo.NomeFile || "Foto",
    description: photo.Descrizione || "",
    date: photo.DataInserimento ? new Date(photo.DataInserimento).toLocaleDateString('it-IT') : ""
  }));

  // If there are no photos and we're not loading, show empty state
  if (photos.length === 0 && !loading) {
    return <GalleryEmptyState className={className} />;
  }

  return (
    <div className={cn("mt-4", className)}>
      {loading ? (
        <GalleryLoading />
      ) : (
        <>
          <PhotoGrid 
            photos={photos}
            loading={loading}
            columns={columns}
            aspect={aspect}
            onPhotoClick={handlePhotoClick}
          />
          
          <ImageLightbox 
            images={lightboxImages}
            open={lightboxOpen}
            initialIndex={currentPhotoIndex}
            onClose={() => setLightboxOpen(false)}
            onDeletePhoto={handlePhotoDelete}
          />
        </>
      )}
    </div>
  );
};

export default BlockGallery;
