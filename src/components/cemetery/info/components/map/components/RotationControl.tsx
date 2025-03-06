
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
    
    // Check initial state
    checkTilt();
    
    return () => {
      google.maps.event.removeListener(tiltListener);
    };
  }, [map]);
  
  const handleRotate = () => {
    if (!map) return;
    
    // If not in 3D mode, switch to 3D mode first
    if (!is3DMode) {
      (map as any).setTilt(45);
      setIs3DMode(true);
      toast.info("Attivata visualizzazione 3D", { duration: 2000 });
    }
    
    // Increment rotation by 45 degrees each time, cycling from 0 to 315
    const newRotation = (rotationDegrees + 45) % 360;
    setRotationDegrees(newRotation);
    
    // Apply the rotation to the map
    (map as any).setHeading(newRotation);
    
    // Show toast message with current rotation
    toast.success(`Mappa ruotata a ${newRotation}°`, { duration: 1500 });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRotate}
      className="flex items-center gap-1 text-xs"
      title={is3DMode ? `Ruota la mappa (${rotationDegrees}°)` : "Attiva 3D e ruota la mappa"}
    >
      <RotateCw className="h-4 w-4" />
      <span>Ruota</span>
    </Button>
  );
};

export default RotationControl;
