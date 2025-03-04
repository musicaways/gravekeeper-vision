
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SectionsListProps {
  sections: Section[];
  loading: boolean;
  error: string | null;
}

export const SectionsList: React.FC<SectionsListProps> = ({ sections, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Nessun settore disponibile per questo cimitero</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {sections.map((section) => (
        <div key={section.Id} className="border rounded-md p-3 hover:bg-accent/5 transition-colors">
          <h3 className="font-medium text-lg mb-1">{section.Nome || section.Codice || `Settore ${section.Id}`}</h3>
          
          {section.blocchi && section.blocchi.length > 0 ? (
            <div className="space-y-2 mt-2">
              {section.blocchi.map((block) => (
                <div key={block.Id} className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm">{block.Nome || block.Codice || `Blocco ${block.Id}`}</span>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                    {block.NumeroLoculi || 0} loculi
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">Nessun blocco disponibile</p>
          )}
        </div>
      ))}
    </div>
  );
};
