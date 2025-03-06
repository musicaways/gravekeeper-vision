
import React, { useEffect } from 'react';

interface PdfCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initialRenderComplete: boolean;
  handleDoubleClick: (e: React.MouseEvent) => void;
  toggleControls: () => void;
  scale: number; // Add scale prop to track changes
}

const PdfCanvas = ({
  canvasRef,
  initialRenderComplete,
  handleDoubleClick,
  toggleControls,
  scale // Accept scale prop
}: PdfCanvasProps) => {
  // Force re-render when scale changes by updating a data attribute
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setAttribute('data-scale', scale.toString());
    }
  }, [scale, canvasRef]);

  return (
    <div 
      className="flex-1 overflow-auto w-full flex items-center justify-center cursor-zoom-in"
      onClick={toggleControls}
      onDoubleClick={handleDoubleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="max-w-full shadow-lg"
        style={{ opacity: initialRenderComplete ? 1 : 0.99 }} // Trick to force re-render
        data-scale={scale} // Add scale as a data attribute for easier debugging
      />
    </div>
  );
};

export default PdfCanvas;
