
import React, { useRef, useEffect, useState } from "react";
import { NicheInfo } from "@/types";

interface NicheMapCanvasProps {
  rows: number;
  columns: number;
  niches: NicheInfo[];
  onNicheClick: (nicheId: string) => void;
}

export const NicheMapCanvas: React.FC<NicheMapCanvasProps> = ({
  rows,
  columns,
  niches,
  onNicheClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNiche, setHoveredNiche] = useState<NicheInfo | null>(null);

  // Calculate grid dimensions
  const cellWidth = 60;
  const cellHeight = 80;
  const gridWidth = columns * cellWidth;
  const gridHeight = rows * cellHeight;

  // Get color based on niche status
  const getNicheColor = (status?: "available" | "reserved" | "occupied" | "maintenance") => {
    switch (status) {
      case "available":
        return "#10b981"; // green
      case "reserved":
        return "#f59e0b"; // yellow
      case "occupied":
        return "#ef4444"; // red
      case "maintenance":
        return "#94a3b8"; // gray
      default:
        return "#e5e7eb"; // light gray
    }
  };

  const getNicheBorderColor = (status?: "available" | "reserved" | "occupied" | "maintenance") => {
    switch (status) {
      case "available":
        return "#059669"; // darker green
      case "reserved":
        return "#d97706"; // darker yellow
      case "occupied":
        return "#b91c1c"; // darker red
      case "maintenance":
        return "#64748b"; // darker gray
      default:
        return "#d1d5db"; // darker light gray
    }
  };

  // Draw the grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

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
        const niche = niches.find((n) => n.row === row + 1 && n.column === col + 1);

        // Calculate position (columns go right to left)
        const x = (columns - col - 1) * cellWidth;
        const y = row * cellHeight;

        // Draw niche cell with appropriate color
        ctx.fillStyle = getNicheColor(niche?.status);
        ctx.fillRect(x, y, cellWidth, cellHeight);
        
        // Draw border
        ctx.strokeStyle = getNicheBorderColor(niche?.status);
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        // Draw niche number
        ctx.fillStyle = "#1f2937"; // dark text
        ctx.font = "12px Inter";
        ctx.fillText(`${row + 1}-${col + 1}`, x + 5, y + 15);

        // Draw deceased name if exists
        if (niche?.deceasedName) {
          ctx.fillStyle = "#1f2937";
          ctx.font = "10px Inter";
          // Truncate long names
          let name = niche.deceasedName;
          if (name.length > 14) {
            name = name.substring(0, 12) + "...";
          }
          ctx.fillText(name, x + 5, y + 35, cellWidth - 10);
        }
      }
    }

    // Draw highlighted cell if hovering
    if (hoveredNiche) {
      const row = hoveredNiche.row - 1;
      const col = hoveredNiche.column - 1;
      const x = (columns - col - 1) * cellWidth;
      const y = row * cellHeight;

      ctx.strokeStyle = "#3b82f6"; // blue highlight
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
    }

    ctx.restore();
  }, [rows, columns, niches, scale, offset, hoveredNiche]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for dragging and hover effects
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - offset.x / scale;
    const y = (e.clientY - rect.top) / scale - offset.y / scale;

    // Get niche under cursor
    const col = columns - Math.floor(x / cellWidth) - 1;
    const row = Math.floor(y / cellHeight);

    if (row >= 0 && row < rows && col >= 0 && col < columns) {
      const niche = niches.find(n => n.row === row + 1 && n.column === col + 1);
      setHoveredNiche(niche || null);
    } else {
      setHoveredNiche(null);
    }

    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave to end dragging
  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredNiche(null);
  };

  // Handle click to select a niche
  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - offset.x / scale;
    const y = (e.clientY - rect.top) / scale - offset.y / scale;

    // Get niche under cursor
    const col = columns - Math.floor(x / cellWidth) - 1;
    const row = Math.floor(y / cellHeight);

    if (row >= 0 && row < rows && col >= 0 && col < columns) {
      const niche = niches.find(n => n.row === row + 1 && n.column === col + 1);
      if (niche) {
        onNicheClick(niche.id);
      }
    }
  };

  // Handle wheel event for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    setScale(newScale);
  };

  // External methods for zoom controls
  const zoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.1));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.1));
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative overflow-hidden border rounded-lg">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-[500px] touch-none cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onWheel={handleWheel}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
          onClick={zoomIn}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
          onClick={zoomOut}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
          onClick={resetView}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>
  );
};
