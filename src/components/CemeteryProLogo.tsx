
import React from "react";

interface CemeteryProLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export const CemeteryProLogo: React.FC<CemeteryProLogoProps> = ({ 
  size = "medium", 
  className = "" 
}) => {
  const sizeClasses = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-4xl",
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} text-primary flex items-center ${className}`}>
      <span className="mr-2">🪦</span>
      <span>CemeteryPro</span>
    </div>
  );
};
