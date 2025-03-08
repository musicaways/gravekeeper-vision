
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

interface DeceasedEmptyStateProps {
  searchTerm: string;
  onClear: () => void;
}

const DeceasedEmptyState: React.FC<DeceasedEmptyStateProps> = ({ searchTerm, onClear }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
      <FileX className="h-12 w-12 text-muted-foreground mb-4" />
      
      {searchTerm ? (
        <>
          <h3 className="text-lg font-medium mb-1">Nessun defunto trovato</h3>
          <p className="text-muted-foreground mb-4">
            Nessun defunto corrisponde alla ricerca "{searchTerm}"
          </p>
          <Button variant="outline" onClick={onClear}>
            Cancella ricerca
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-1">Nessun defunto registrato</h3>
          <p className="text-muted-foreground">
            Non ci sono defunti registrati nel sistema
          </p>
        </>
      )}
    </div>
  );
};

export default DeceasedEmptyState;
