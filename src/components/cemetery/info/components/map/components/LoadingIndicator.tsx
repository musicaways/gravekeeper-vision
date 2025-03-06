
import React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center bg-card p-4 rounded-lg shadow-md">
        <div className="w-12 h-12 border-4 border-t-primary border-r-primary/50 border-b-primary/30 border-l-primary/10 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium">Caricamento mappa in corso...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
