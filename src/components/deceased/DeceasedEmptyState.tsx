
import React from "react";
import { FileQuestion, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DeceasedEmptyStateProps {
  searchTerm?: string;
  cemeteryName?: string | null;
  error?: string | null;
  onClear: () => void;
}

const DeceasedEmptyState: React.FC<DeceasedEmptyStateProps> = ({ 
  searchTerm,
  cemeteryName,
  error,
  onClear 
}) => {
  // If there's an error, show the error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Errore</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
