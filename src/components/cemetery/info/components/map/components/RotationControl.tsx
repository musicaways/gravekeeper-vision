
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";

interface RotationControlProps {
  map: google.maps.Map | null;
}

const RotationControl: React.FC<RotationControlProps> = ({ map }) => {
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [is3DMode, setIs3DMode] = useState(false);
  
  // Detect when 3D mode changes
  useEffect(() => {
    if (!map) return;
    
    // Check initial tilt
    const checkTilt = () => {
      const currentTilt = (map as any).getTilt?.() || 0;
      setIs3DMode(currentTilt > 0);
    };
    
    // Check tilt when map is idle (after any operation completes)
    const tiltListener = google.maps.event.addListener(map, 'idle', checkTilt);
    
    // Listen for custom tilt change events from TiltControl
    const tiltChangeHandler = (event: CustomEvent) => {
      setIs3DMode(event.detail.tilt > 0);
      // Reset rotation degrees when switching to 3D mode
      if (event.detail.tilt > 0) {
        setRotationDegrees(0);
      }
    };
    
    document.addEventListener('tiltchange', tiltChangeHandler as EventListener);
    
    // Check initial state
    checkTilt();
    
    return () => {
      google.maps.event.removeListener(tiltListener);
      document.removeEventListener('tiltchange', tiltChangeHandler as EventListener);
    };
  }, [map]);
  
  const handleRotate = () => {
    if (!map) return;
    
    // Increment rotation by 45 degrees each time, cycling from 0 to 315
    const newRotation = (rotationDegrees + 45) % 360;
    setRotationDegrees(newRotation);
    
    // Apply the rotation to the map
    (map as any).setHeading(newRotation);
    
    // Show toast message with current rotation
    toast.success(`Mappa ruotata a ${newRotation}°`, { duration: 1500 });
  };

  // Only render the button when in 3D mode
  if (!is3DMode) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRotate}
      className="flex items-center gap-1 text-xs"
      title={`Ruota la mappa (${rotationDegrees}°)`}
    >
      <RotateCw className="h-4 w-4" />
      <span>Ruota</span>
    </Button>
  );
};

export default RotationControl;
