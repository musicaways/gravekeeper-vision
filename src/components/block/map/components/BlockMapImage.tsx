
import React from "react";

interface BlockMapImageProps {
  mapUrl: string;
  onError: () => void;
}

const BlockMapImage: React.FC<BlockMapImageProps> = ({ mapUrl, onError }) => {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-md">
      <img
        src={mapUrl}
        alt="Mappa del blocco"
        className="w-full h-full object-cover"
        onError={onError}
      />
    </div>
  );
};

export default BlockMapImage;
