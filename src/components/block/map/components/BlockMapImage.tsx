
import React from "react";

interface BlockMapImageProps {
  mapUrl: string;
  onError: () => void;
}

const BlockMapImage: React.FC<BlockMapImageProps> = ({ mapUrl, onError }) => {
  return (
    <div className="rounded-md overflow-hidden border border-border h-[400px] mt-4">
      <img 
        src={mapUrl} 
        alt="Mappa del blocco" 
        className="w-full h-full object-contain"
        onError={(e) => {
          console.error("Error loading map image:", e);
          onError();
        }}
      />
    </div>
  );
};

export default BlockMapImage;
