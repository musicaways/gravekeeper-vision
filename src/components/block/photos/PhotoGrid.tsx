
import React from "react";
import { BlockPhoto } from "./useBlockPhotos";
import PhotoItem from "./PhotoItem";
import GalleryEmptyState from "./GalleryEmptyState";
import GalleryLoading from "./GalleryLoading";
import { useGalleryLayout } from "@/components/cemetery/photos/galleryUtils";

interface PhotoGridProps {
  photos: BlockPhoto[];
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
  // Get the grid and aspect classes from the cemetery gallery utils
  const { aspectClass } = useGalleryLayout(3, aspect);

  if (loading) {
    return <GalleryLoading />;
  }

  if (photos.length === 0) {
    return <GalleryEmptyState />;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
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
