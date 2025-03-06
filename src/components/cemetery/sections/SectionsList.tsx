
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

interface SectionsListProps {
  sections: Section[];
  loading: boolean;
  error: string | null;
}

export const SectionsList: React.FC<SectionsListProps> = ({ sections, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-1">
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
      <Alert variant="destructive" className="mx-1">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-10 px-1">
        <p className="text-muted-foreground">Nessun settore disponibile per questo cimitero</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-1">
      {sections.map((section) => (
        <div key={section.Id} className="border rounded-md hover:bg-accent/5 transition-colors">
          <div className="bg-primary/10 px-3 py-2 rounded-t-md border-b">
            <h3 className="font-medium text-base text-primary-dark">
              {section.Nome || section.Codice || `Settore ${section.Id}`}
            </h3>
          </div>
          
          {section.blocchi && section.blocchi.length > 0 ? (
            <div className="space-y-0 divide-y">
              {section.blocchi.map((block) => (
                <Link 
                  to={`/block/${block.Id}`} 
                  key={block.Id} 
                  className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium truncate mr-2">{block.Nome || block.Codice || `Blocco ${block.Id}`}</span>
                  <Badge variant="outline" className="whitespace-nowrap ml-auto shrink-0 min-w-[70px] text-center text-xs">
                    {block.NumeroLoculi || 0} loculi
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground p-3">Nessun blocco disponibile</p>
          )}
        </div>
      ))}
    </div>
  );
};
