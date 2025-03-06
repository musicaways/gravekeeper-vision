
import React from "react";
import { ImageIcon } from "lucide-react";

const GalleryEmptyState: React.FC = () => {
  return (
    <div className="py-4 text-center text-muted-foreground">
      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
      <p>Nessuna foto disponibile</p>
    </div>
  );
};

export default GalleryEmptyState;
