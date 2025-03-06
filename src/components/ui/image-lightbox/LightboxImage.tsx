
import { motion } from "framer-motion";
import { LightboxImage as LightboxImageType } from "./types";

interface LightboxImageProps {
  imageRef: React.RefObject<HTMLImageElement>;
  currentImage: LightboxImageType;
  title: string;
  scale: number;
  position: { x: number; y: number };
  dragging: boolean;
  swipeDirection: null | "left" | "right";
  setScale: (scale: number) => void;
}

const LightboxImage = ({
  imageRef,
  currentImage,
  title,
  scale,
  position,
  dragging,
  swipeDirection,
  setScale
}: LightboxImageProps) => {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center">
      <motion.img 
        ref={imageRef}
        src={currentImage.url} 
        alt={title || ""}
        className="max-h-[80vh] max-w-[85vw] object-contain select-none"
        style={{ 
          scale,
          x: position.x,
          y: position.y,
          cursor: dragging ? "grabbing" : (scale > 1 ? "grab" : "default"),
          transform: swipeDirection ? `translateX(${swipeDirection === "right" ? "-50px" : "50px"})` : undefined
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setScale(scale === 1 ? 2 : 1);
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        drag={scale > 1}
        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
        dragElastic={0.1}
      />
    </motion.div>
  );
};

export default LightboxImage;
