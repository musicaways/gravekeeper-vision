
import { motion } from "framer-motion";
import { LightboxImage as LightboxImageType } from "./types";
import Image from "next/image";
import React from "react";

interface LightboxImageProps {
  imageRef: React.RefObject<HTMLImageElement>;
  currentImage: LightboxImageType | null;
  title: string;
  scale: number;
  position: { x: number; y: number };
  dragging: boolean;
  swipeDirection: string | null;
  setScale: (scale: number) => void;
  onDoubleClick?: (e: React.MouseEvent | React.TouchEvent) => void;
}

const LightboxImage: React.FC<LightboxImageProps> = ({
  imageRef,
  currentImage,
  title,
  scale,
  position,
  dragging,
  swipeDirection,
  onDoubleClick
}) => {
  if (!currentImage) return null;
  
  const transformStyle = {
    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
    transition: dragging ? 'none' : 'transform 0.2s ease-out',
    transformOrigin: 'center',
    touchAction: scale > 1 ? 'none' : 'pan-y'
  };

  // Use swipe direction to add visual feedback during swipe
  const getSwipeTransform = () => {
    if (!swipeDirection || scale > 1) return {};
    const swipeOffset = swipeDirection === 'left' ? -30 : 30;
    return {
      transform: `translateX(${swipeOffset}px)`,
      opacity: 0.7,
    };
  };

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <motion.img
        ref={imageRef}
        src={currentImage.url}
        alt={title || "Foto"}
        className={`max-h-full max-w-full object-contain ${dragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'}`}
        style={{
          ...transformStyle,
          ...(swipeDirection && getSwipeTransform()),
        }}
        onDoubleClick={onDoubleClick}
        draggable={false}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        loading="eager"
      />
    </div>
  );
};

export default LightboxImage;
