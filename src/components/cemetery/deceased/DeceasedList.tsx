
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, UserRound } from "lucide-react";
import { formatDate } from "./deceasedUtils";

interface DeceasedListProps {
  deceased: any[] | null;
  isLoading: boolean;
  isError: boolean;
  onAddClick: () => void;
  onRetry: () => void;
}

export const DeceasedList: React.FC<DeceasedListProps> = ({
  deceased,
  isLoading,
  isError,
  onAddClick,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Si è verificato un errore durante il caricamento dei dati</p>
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Riprova
        </Button>
      </div>
    );
  }

  if (!deceased || deceased.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Nessun defunto registrato per questo cimitero</p>
        <Button variant="outline" className="mt-4" onClick={onAddClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Aggiungi un nuovo defunto
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {deceased.map((person) => (
          <div key={person.Id} className="flex items-start space-x-4 rounded-md border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <UserRound className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium leading-none">{person.Nominativo}</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {person.DataNascita && (
                  <div className="flex items-center">
                    <span>Nascita: {formatDate(person.DataNascita)}</span>
                  </div>
                )}
                {person.DataDecesso && (
                  <div className="flex items-center">
                    <span>Decesso: {formatDate(person.DataDecesso)}</span>
                  </div>
                )}
                {person.Sesso && (
                  <div className="flex items-center">
                    <span>Genere: {person.Sesso === 'male' ? 'Maschio' : person.Sesso === 'female' ? 'Femmina' : 'Non specificato'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
