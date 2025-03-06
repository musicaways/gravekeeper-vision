
import React from "react";

const MapLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="h-8 w-8 rounded-full border-2 border-t-primary border-primary/30 animate-spin"></div>
      <span className="ml-2">Caricamento mappa...</span>
    </div>
  );
};

export default MapLoadingState;
