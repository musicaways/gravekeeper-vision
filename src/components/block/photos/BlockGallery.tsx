
import React, { useState, useEffect } from "react";
import { useBlockPhotos } from "./useBlockPhotos";
import GalleryEmptyState from "./GalleryEmptyState";
import GalleryLoading from "./GalleryLoading";
import PhotoGrid from "./PhotoGrid";
import ImageLightbox from "@/components/ui/image-lightbox";
import { cn } from "@/lib/utils";
import { LightboxImage } from "@/components/ui/image-lightbox/types";

interface BlockGalleryProps {
  blockId: string;
  columns?: 1 | 2 | 3 | 4;
  aspect?: "square" | "video" | "wide";
  className?: string;
  refreshKey?: number;
}

const BlockGallery: React.FC<BlockGalleryProps> = ({ 
  blockId,
  columns = 3,
  aspect = "square",
  className,
  refreshKey = 0
}) => {
  const { photos, loading, refetch, deletePhoto } = useBlockPhotos(blockId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Use refreshKey to trigger refetch when it changes
  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handlePhotoDelete = async (photoId: string): Promise<void> => {
    const success = await deletePhoto(photoId);
    if (success) {
      setLightboxOpen(false);
    }
  };

  // Transform the photos for the lightbox
  const lightboxImages: LightboxImage[] = photos.map(photo => ({
    url: photo.Url,
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
    <div className={cn("p-3", className)}>
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
