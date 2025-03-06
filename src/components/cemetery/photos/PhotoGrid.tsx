
import React from "react";
import { Photo } from "./types";
import PhotoItem from "./PhotoItem";
import GalleryEmptyState from "./GalleryEmptyState";
import GalleryLoading from "./GalleryLoading";
import { useGalleryLayout } from "./galleryUtils";
import { LightboxImage } from "@/components/ui/image-lightbox";

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  columns: 1 | 2 | 3 | 4;
  aspect: "square" | "video" | "wide";
  onPhotoClick: (index: number) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  loading, 
  columns, 
  aspect,
  onPhotoClick 
}) => {
  const { gridClass, aspectClass } = useGalleryLayout(columns, aspect);

  if (loading) {
    return <GalleryLoading />;
  }

  if (photos.length === 0) {
    return <GalleryEmptyState />;
  }

  return (
    <div className={`grid ${gridClass} gap-1`}>
      {photos.map((photo, index) => (
        <PhotoItem 
          key={photo.Id} 
          photo={photo} 
          aspectClass={aspectClass}
          onClick={() => onPhotoClick(index)} 
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
