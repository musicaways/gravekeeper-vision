
import React from 'react';

interface PdfCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initialRenderComplete: boolean;
  handleDoubleClick: (e: React.MouseEvent) => void;
  toggleControls: () => void;
}

const PdfCanvas = ({
  canvasRef,
  initialRenderComplete,
  handleDoubleClick,
  toggleControls
}: PdfCanvasProps) => {
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
      />
    </div>
  );
};

export default PdfCanvas;
