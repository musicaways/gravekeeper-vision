
import React from "react";
import { BlockPhoto } from "./useBlockPhotos";
import PhotoItem from "./PhotoItem";
import GalleryEmptyState from "./GalleryEmptyState";
import GalleryLoading from "./GalleryLoading";

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
  const gridClassMap = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
  };

  const aspectClassMap = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]"
  };

  if (loading) {
    return <GalleryLoading />;
  }

  if (photos.length === 0) {
    return <GalleryEmptyState />;
  }

  return (
    <div className={`grid ${gridClassMap[columns]} gap-3`}>
      {photos.map((photo, index) => (
        <PhotoItem 
          key={photo.Id} 
          photo={photo} 
          aspectClass={aspectClassMap[aspect]}
          onClick={() => onPhotoClick(index)} 
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
