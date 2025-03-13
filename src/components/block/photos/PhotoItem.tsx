
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlockPhoto } from "./useBlockPhotos";

interface PhotoItemProps {
  photo: BlockPhoto;
  aspectClass: string;
  onClick: () => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, aspectClass, onClick }) => {
  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-md"
      onClick={onClick}
    >
      <AspectRatio ratio={1} className={`bg-muted ${aspectClass}`}>
        <img 
          src={photo.Url} 
          alt={photo.Descrizione || `Foto`} 
          className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" 
        />
      </AspectRatio>
    </div>
  );
};

export default PhotoItem;
