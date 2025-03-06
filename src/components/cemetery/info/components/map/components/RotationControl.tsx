
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface RotationControlProps {
  map: google.maps.Map | null;
}

const RotationControl: React.FC<RotationControlProps> = ({ map }) => {
  const [rotationDegrees, setRotationDegrees] = React.useState(0);
  
  const handleRotate = () => {
    if (!map) return;
    
    // Increment rotation by 45 degrees each time, cycling from 0 to 315
    const newRotation = (rotationDegrees + 45) % 360;
    setRotationDegrees(newRotation);
    
    // Apply the rotation to the map - using the heading property
    // Use type assertion since setHeading might not be in the type definitions
    (map as any).setHeading(newRotation);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRotate}
      className="flex items-center gap-1 text-xs"
      title="Ruota la mappa"
    >
      <RotateCw className="h-4 w-4" />
      <span>Ruota</span>
    </Button>
  );
};

export default RotationControl;
