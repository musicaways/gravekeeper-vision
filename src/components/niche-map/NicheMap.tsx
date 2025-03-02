
import React, { useState, useEffect, useRef } from 'react';
import { NicheMapProps, NicheInfo } from '@/types';
import { getNicheColorFromStatus } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import NicheDetail from './NicheDetail';

const NicheMap: React.FC<NicheMapProps> = ({ 
  blockId, 
  rows, 
  columns, 
  niches, 
  onNicheClick 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNiche, setSelectedNiche] = useState<NicheInfo | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Calculate grid dimensions
  const cellWidth = 60;
  const cellHeight = 80;
  const gridWidth = columns * cellWidth;
  const gridHeight = rows * cellHeight;
  
  // Canvas size (with some padding)
  const canvasWidth = Math.max(gridWidth * scale + 40, 300);
  const canvasHeight = Math.max(gridHeight * scale + 40, 200);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);
    
    // Draw grid background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, gridWidth, gridHeight);
    
    // Draw niches
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Find niche at this position (if any)
        const niche = niches.find(n => n.row === row && n.column === col);
        
        // Calculate position (columns go right to left)
        const x = gridWidth - (col + 1) * cellWidth;
        const y = row * cellHeight;
        
        // Draw niche cell with appropriate color
        if (niche) {
          // Background
          ctx.fillStyle = getNicheColorFromStatus(niche.status);
          ctx.fillRect(x, y, cellWidth, cellHeight);
          
          // Border
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, cellWidth, cellHeight);
          
          // Niche number
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Inter';
          ctx.fillText(`${row+1}-${col+1}`, x + 5, y + 15);
          
          // Deceased name if occupied
          if (niche.deceasedName && niche.status === 'occupied') {
            ctx.font = '10px Inter';
            // Truncate if too long
            let displayName = niche.deceasedName;
            if (displayName.length > 12) {
              displayName = displayName.substring(0, 12) + '...';
            }
            ctx.fillText(displayName, x + 5, y + 35, cellWidth - 10);
          }
          
          // Add reserved or maintenance indicator
          if (niche.status === 'reserved' || niche.status === 'maintenance') {
            ctx.font = '10px Inter';
            ctx.fillText(
              niche.status === 'reserved' ? 'Reserved' : 'Maintenance', 
              x + 5, 
              y + 35, 
              cellWidth - 10
            );
            
            if (niche.expirationDate && niche.status === 'reserved') {
              ctx.fillText(
                `Until: ${new Date(niche.expirationDate).toLocaleDateString()}`, 
                x + 5, 
                y + 50, 
                cellWidth - 10
              );
            }
          }
        } else {
          // Empty cell (no niche assigned)
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(x, y, cellWidth, cellHeight);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
      }
    }
    
    ctx.restore();
  }, [rows, columns, niches, scale, offset, gridWidth, gridHeight]);
  
  // Handle canvas click to select a niche
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isPanning) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate click position in grid coordinates
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    
    // Convert to row and column indices
    const col = columns - Math.floor(x / cellWidth) - 1;
    const row = Math.floor(y / cellHeight);
    
    // Check if click is within grid bounds
    if (row >= 0 && row < rows && col >= 0 && col < columns) {
      // Find niche at this position
      const niche = niches.find(n => n.row === row && n.column === col);
      
      if (niche) {
        setSelectedNiche(niche);
        setShowDetailModal(true);
        onNicheClick(niche.id);
      }
    }
  };
  
  // Zoom in/out with mouse wheel
  const handleZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.1;
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    setScale(newScale);
  };
  
  // Pan handling
  const handlePanStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };
  
  const handlePanMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;
    
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setPanStart({ x: e.clientX, y: e.clientY });
  };
  
  const handlePanEnd = () => {
    setIsPanning(false);
  };
  
  // Reset zoom and position
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };
  
  // Handle zoom in/out button clicks
  const handleZoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.1));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.1));
  };
  
  return (
    <div ref={containerRef} className="relative bg-white border rounded-lg shadow-md overflow-hidden select-none">
      <div className="p-3 bg-gradient-to-r from-primary-light to-primary font-medium text-white flex items-center justify-between">
        <h3>Block #{blockId} Niche Map</h3>
        <div className="text-xs font-normal opacity-80">
          {rows} rows × {columns} columns
        </div>
      </div>
      
      <div className="p-4 overflow-auto" style={{ maxHeight: '70vh' }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
          onWheel={handleZoom}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          className="touch-none cursor-move"
        />
      </div>
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={handleReset}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 bg-white bg-opacity-80 p-2 rounded-md text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getNicheColorFromStatus('available') }}></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getNicheColorFromStatus('reserved') }}></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getNicheColorFromStatus('occupied') }}></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getNicheColorFromStatus('maintenance') }}></div>
          <span>Maintenance</span>
        </div>
      </div>
      
      {/* Niche detail modal */}
      {showDetailModal && selectedNiche && (
        <NicheDetail 
          niche={selectedNiche} 
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default NicheMap;
