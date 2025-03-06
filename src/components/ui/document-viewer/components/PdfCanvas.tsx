
import React, { useEffect, useState, useRef, useCallback } from 'react';

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
  const previousScale = useRef(scale);
  const renderTimestamp = useRef(Date.now());

  // Force re-render and reset position when scale changes
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setAttribute('data-scale', scale.toString());
      renderTimestamp.current = Date.now();
      
      // If scale changed, log it
      if (previousScale.current !== scale) {
        console.log(`PdfCanvas: Scale changed from ${previousScale.current} to ${scale}`);
        previousScale.current = scale;
      }
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

  // Creating memoized touch handlers to prevent unnecessary re-renders
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scale <= 1) return;
    
    e.stopPropagation(); // Stop event propagation to prevent conflicts
    touchMoveCount.current = 0;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
    // Immediately disable swipe when in zoom mode and starting to drag
    setSwipeEnabled(false);
    console.log("PdfCanvas: Touch start for panning, disabling swipe navigation");
  }, [scale, position, setSwipeEnabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || scale <= 1) return;
    
    touchMoveCount.current += 1;
    
    // Only prevent default after confirming we're really dragging (after a few move events)
    if (touchMoveCount.current > 3) {
      e.preventDefault(); // Prevent scrolling when dragging
      e.stopPropagation(); // Stop event propagation to prevent conflicts
    }
    
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    
    // Add bounds to prevent dragging too far
    // Calcolo adeguato dei limiti in base alle dimensioni del canvas e al livello di zoom
    const maxDragX = Math.max(0, (scale - 1) * (canvasRef.current?.width || 0) / 2);
    const maxDragY = Math.max(0, (scale - 1) * (canvasRef.current?.height || 0) / 2);
    
    const boundedX = Math.min(Math.max(newX, -maxDragX), maxDragX);
    const boundedY = Math.min(Math.max(newY, -maxDragY), maxDragY);
    
    setPosition({ x: boundedX, y: boundedY });
  }, [isDragging, scale, dragStart, canvasRef]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.stopPropagation(); // Stop event propagation to prevent conflicts
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
  }, [isDragging, scale, setSwipeEnabled]);

  // Aggiungiamo supporto anche per il mouse
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    // Disable swipe when mouse dragging in zoom mode
    setSwipeEnabled(false);
    console.log("PdfCanvas: Mouse down for panning, disabling swipe navigation");
  }, [scale, position, setSwipeEnabled]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Add bounds to prevent dragging too far
    const maxDragX = Math.max(0, (scale - 1) * (canvasRef.current?.width || 0) / 2);
    const maxDragY = Math.max(0, (scale - 1) * (canvasRef.current?.height || 0) / 2);
    
    const boundedX = Math.min(Math.max(newX, -maxDragX), maxDragX);
    const boundedY = Math.min(Math.max(newY, -maxDragY), maxDragY);
    
    setPosition({ x: boundedX, y: boundedY });
  }, [isDragging, scale, dragStart, canvasRef]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Re-enable swipe with a small delay if scale is 1 or less
    setTimeout(() => {
      if (scale <= 1) {
        setSwipeEnabled(true);
        console.log("PdfCanvas: Re-enabling swipe navigation after mouse panning");
      }
    }, 300);
  }, [isDragging, scale, setSwipeEnabled]);

  // Add global mouse event handlers when dragging
  useEffect(() => {
    if (isDragging && scale > 1) {
      document.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, scale, handleMouseMove, handleMouseUp]);

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
        onMouseDown={handleMouseDown}
      >
        <canvas 
          ref={canvasRef} 
          className="max-w-full shadow-lg"
          style={{ 
            opacity: initialRenderComplete ? 1 : 0.5, // Increased opacity for better visibility
            transition: 'opacity 0.3s ease',
            border: !initialRenderComplete ? '1px dashed rgba(0,0,0,0.2)' : 'none', // Visual indicator while loading
            transform: `scale(${scale})`, // Applicare lo scale anche visivamente al canvas
            transformOrigin: 'center',
          }}
          data-scale={scale}
          data-render-timestamp={renderTimestamp.current}
        />
        {!initialRenderComplete && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-opacity-70">
            <p>Caricamento PDF...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfCanvas;
