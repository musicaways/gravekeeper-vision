
import React, { useEffect, useState } from 'react';

interface PdfCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initialRenderComplete: boolean;
  handleDoubleClick: (e: React.MouseEvent) => void;
  toggleControls: () => void;
  scale: number;
  setSwipeEnabled: (enabled: boolean) => void;
}

const PdfCanvas = ({
  canvasRef,
  initialRenderComplete,
  handleDoubleClick,
  toggleControls,
  scale,
  setSwipeEnabled
}: PdfCanvasProps) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Force re-render when scale changes by updating a data attribute
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setAttribute('data-scale', scale.toString());
    }
    
    // Update swipe enabled state based on scale
    setSwipeEnabled(scale <= 1);
    console.log("PdfCanvas: Updated swipe enabled state:", scale <= 1);
  }, [scale, canvasRef, setSwipeEnabled]);

  // Reset position when scale changes to 1
  useEffect(() => {
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
    console.log("PdfCanvas: Touch start, disabling swipe navigation");
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
    <div 
      className="flex-1 overflow-auto w-full flex items-center justify-center cursor-zoom-in"
      onClick={toggleControls}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas 
          ref={canvasRef} 
          className="max-w-full shadow-lg"
          style={{ opacity: initialRenderComplete ? 1 : 0.99 }}
          data-scale={scale}
        />
      </div>
    </div>
  );
};

export default PdfCanvas;
