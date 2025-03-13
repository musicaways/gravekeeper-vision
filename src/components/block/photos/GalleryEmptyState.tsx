
import React from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryEmptyStateProps {
  className?: string;
}

const GalleryEmptyState: React.FC<GalleryEmptyStateProps> = ({ className }) => {
  return (
    <div className={cn("w-full py-8 flex flex-col items-center justify-center rounded-lg border border-dashed", className)}>
      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" strokeWidth={1.5} />
      <h3 className="text-lg font-medium">Nessuna foto</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
        Non ci sono foto caricate per questo blocco. Usa il pulsante in basso per aggiungere nuove foto.
      </p>
    </div>
  );
};

export default GalleryEmptyState;
