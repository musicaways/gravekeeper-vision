
import React from "react";
import { FileQuestion } from "lucide-react";

interface DeceasedEmptyStateProps {
  searchTerm?: string;
  cemeteryName?: string | null;
  onClear: () => void;
}

const DeceasedEmptyState: React.FC<DeceasedEmptyStateProps> = ({ 
  searchTerm,
  cemeteryName,
  onClear 
}) => {
  // Determine the primary reason for no results
  let title = "Nessun defunto trovato";
  let description = "Non sono stati trovati defunti con i criteri selezionati.";

  if (searchTerm && searchTerm.trim() !== '') {
    title = "Nessun risultato per la ricerca";
    description = `Nessun defunto corrisponde al termine di ricerca "${searchTerm}".`;
  } else if (cemeteryName) {
    title = "Nessun defunto trovato nel cimitero selezionato";
    description = `Non sono stati trovati defunti per il cimitero "${cemeteryName}".`;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/40 rounded-lg min-h-[200px]">
      <div className="rounded-full bg-background p-4 mb-4">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
    </div>
  );
};

export default DeceasedEmptyState;
