
import { useEffect, useRef, useState } from "react";
import { NicheMapProps, NicheInfo } from "@/types";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function NicheMapCanvas({ blockId, rows, columns, niches, onNicheClick }: NicheMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Calculate grid dimensions
  const cellWidth = 60;
  const cellHeight = 80;
  const gridWidth = columns * cellWidth;
  const gridHeight = rows * cellHeight;
  
  // Draw the niche map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);
    
    // Draw grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Find niche at this position
        const niche = niches.find(n => n.row === row && n.column === col);
        
        // Calculate position (columns go right to left)
        const x = gridWidth - (col + 1) * cellWidth;
        const y = row * cellHeight;
        
        // Draw niche cell with appropriate color
        ctx.fillStyle = getNicheColor(niche?.status);
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
        
        // Draw niche number and info
        if (niche) {
          ctx.fillStyle = '#000';
          ctx.font = '12px Inter';
          ctx.fillText(`${row+1}-${col+1}`, x + 5, y + 15);
          if (niche.deceasedName) {
            ctx.fillText(truncateText(niche.deceasedName, 10), x + 5, y + 35, cellWidth - 10);
          }
          
          // Draw expiration info if available
          if (niche.expirationDate) {
            ctx.font = '10px Inter';
            ctx.fillText(formatDate(niche.expirationDate), x + 5, y + 55, cellWidth - 10);
          }
        } else {
          // Draw niche position for empty niches
          ctx.fillStyle = '#666';
          ctx.font = '12px Inter';
          ctx.fillText(`${row+1}-${col+1}`, x + 5, y + 15);
        }
      }
    }
    
    ctx.restore();
  }, [rows, columns, niches, scale, offset, gridWidth, gridHeight, cellWidth, cellHeight]);
  
  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    // Get click position relative to canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    
    // Calculate which niche was clicked
    const col = columns - Math.floor(x / cellWidth) - 1;
    const row = Math.floor(y / cellHeight);
    
    // Make sure we're within bounds
    if (row >= 0 && row < rows && col >= 0 && col < columns) {
      // Find the niche at this position
      const niche = niches.find(n => n.row === row && n.column === col);
      
      // Call the callback function with the niche ID if found
      if (niche) {
        onNicheClick(niche.id);
      }
    }
  };
  
  // Handle pan start
  const handlePanStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle pan move
  const handlePanMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle pan end
  const handlePanEnd = () => {
    setIsDragging(false);
  };
  
  // Handle zoom
  const handleZoom = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    
    setScale(newScale);
  };
  
  // Reset view
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };
  
  // Helper functions
  function getNicheColor(status?: string): string {
    switch (status) {
      case 'available': return '#d1fae5'; // green
      case 'reserved': return '#fee2e2'; // light red
      case 'occupied': return '#f87171'; // red
      case 'maintenance': return '#fef3c7'; // yellow
      default: return '#e5e7eb'; // gray
    }
  }
  
  function truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  function formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  }
  
  return (
    <div className="relative overflow-hidden border rounded-lg">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        onWheel={handleZoom}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        className="touch-none cursor-grab"
        style={{cursor: isDragging ? 'grabbing' : 'grab'}}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button 
          size="icon" 
          variant="secondary"
          onClick={() => setScale(s => Math.min(3, s + 0.1))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          onClick={resetView}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
