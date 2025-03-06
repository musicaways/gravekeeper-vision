
import React, { useEffect, useState, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const touchMoveCount = useRef(0);
  const touchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Force re-render when scale changes by updating a data attribute
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setAttribute('data-scale', scale.toString());
    }
    
    // Update swipe enabled state based on scale
    const shouldEnableSwipe = scale <= 1;
    setSwipeEnabled(shouldEnableSwipe);
    console.log("PdfCanvas: Updated swipe enabled state:", shouldEnableSwipe);
    
    // Reset position when scale is reset to 1 or less
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
    
    return () => {
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }
    };
  }, [scale, canvasRef, setSwipeEnabled]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return;
    
    touchMoveCount.current = 0;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
    // Immediately disable swipe when in zoom mode and starting to drag
    setSwipeEnabled(false);
    console.log("PdfCanvas: Touch start for panning, disabling swipe navigation");
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1) return;
    
    touchMoveCount.current += 1;
    
    // Only prevent default after confirming we're really dragging (after a few move events)
    if (touchMoveCount.current > 3) {
      e.preventDefault(); // Prevent scrolling when dragging
    }
    
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    
    // Add bounds to prevent dragging too far
    const maxDragX = Math.max(0, (scale - 1) * (canvasRef.current?.width || 0) / 2);
    const maxDragY = Math.max(0, (scale - 1) * (canvasRef.current?.height || 0) / 2);
    
    const boundedX = Math.min(Math.max(newX, -maxDragX), maxDragX);
    const boundedY = Math.min(Math.max(newY, -maxDragY), maxDragY);
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    
    // Clear any existing timeout
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
    }
    
    // Only re-enable swipe if scale is 1 or less
    // Small delay to prevent accidental swipe
    touchTimeout.current = setTimeout(() => {
      if (scale <= 1) {
        setSwipeEnabled(true);
        console.log("PdfCanvas: Re-enabling swipe navigation after panning");
      }
    }, 300);
  };

  return (
    <div 
      className="flex-1 overflow-auto w-full flex items-center justify-center cursor-zoom-in"
      onClick={toggleControls}
      onDoubleClick={handleDoubleClick}
      ref={containerRef}
    >
      <div 
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          willChange: isDragging ? 'transform' : 'auto' // Performance optimization
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas 
          ref={canvasRef} 
          className="max-w-full shadow-lg"
          style={{ opacity: initialRenderComplete ? 1 : 0, transition: 'opacity 0.3s ease' }}
          data-scale={scale}
        />
      </div>
    </div>
  );
};

export default PdfCanvas;
