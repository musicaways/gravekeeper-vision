
import React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-t-primary border-primary/30 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm">Caricamento mappa in corso...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
