
import React from "react";

interface UploadProgressBarProps {
  progress: number;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ progress }) => {
  if (progress <= 0) return null;
  
  return (
    <div className="w-full bg-muted rounded-full h-2.5">
      <div 
        className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default UploadProgressBar;
