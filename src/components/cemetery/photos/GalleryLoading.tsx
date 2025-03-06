
import React from "react";
import { Loader2 } from "lucide-react";

const GalleryLoading: React.FC = () => {
  return (
    <div className="py-4 text-center">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
      <p>Caricamento foto...</p>
    </div>
  );
};

export default GalleryLoading;
