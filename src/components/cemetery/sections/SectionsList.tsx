
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "./types";
import { SectionCard } from "./SectionCard";

interface SectionsListProps {
  sections: Section[];
  loading: boolean;
}

export const SectionsList: React.FC<SectionsListProps> = ({ sections, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Nessun settore disponibile per questo cimitero</p>
        <Button variant="outline" className="mt-4">
          Aggiungi un nuovo settore
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <SectionCard key={section.Id} section={section} />
      ))}
    </div>
  );
};
