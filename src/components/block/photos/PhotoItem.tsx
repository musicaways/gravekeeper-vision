
import React from "react";
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
      <div className="aspect-square bg-muted">
        <img 
          src={photo.Url} 
          alt={photo.Descrizione || `Foto`} 
          className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" 
        />
      </div>
    </div>
  );
};

export default PhotoItem;
