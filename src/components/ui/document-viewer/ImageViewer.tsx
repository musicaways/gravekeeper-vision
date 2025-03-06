
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ImageViewerProps {
  url: string;
  title: string;
  scale: number;
  toggleControls: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  setSwipeEnabled: (enabled: boolean) => void;
}

const ImageViewer = ({
  url,
  title,
  scale,
  toggleControls,
  handleDoubleClick,
  setSwipeEnabled
}: ImageViewerProps) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Reset position when scale changes to 1
  useEffect(() => {
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
    
    // Update swipe enabled state based on scale
    setSwipeEnabled(scale <= 1);
    console.log("ImageViewer: Updated swipe enabled state:", scale <= 1);
  }, [scale, setSwipeEnabled]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
    
    console.log("ImageViewer: Touch start, disabling swipe navigation");
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1) return;
    
    e.stopPropagation();
    e.preventDefault(); // Prevent scrolling when dragging

    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    
    // Add bounds to prevent dragging too far
    const maxDrag = (scale - 1) * 300; // Limit based on scale
    const boundedX = Math.min(Math.max(newX, -maxDrag), maxDrag);
    const boundedY = Math.min(Math.max(newY, -maxDrag), maxDrag);
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div 
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.img
          src={url}
          alt={title}
          className="max-h-full max-w-full object-contain cursor-zoom-in"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
          onClick={(e) => {
            e.stopPropagation();
            toggleControls();
          }}
          onDoubleClick={handleDoubleClick}
          draggable={false}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      </div>
    </div>
  );
};

export default ImageViewer;
