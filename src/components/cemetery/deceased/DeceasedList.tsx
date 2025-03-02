
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, UserRound, CalendarIcon, CircleX, Clock } from "lucide-react";
import { formatDate } from "./deceasedUtils";
import { Badge } from "@/components/ui/badge";

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
        <CircleX className="h-12 w-12 text-destructive mx-auto mb-4" />
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
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        {deceased.map((person) => (
          <div key={person.Id} className="flex items-start space-x-4 rounded-md border p-4 hover:bg-muted/40 transition-colors">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <UserRound className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-lg leading-none">{person.Nominativo}</h4>
                {person.Sesso && (
                  <Badge variant={person.Sesso === 'male' ? 'default' : person.Sesso === 'female' ? 'secondary' : 'outline'}>
                    {person.Sesso === 'male' ? 'Maschio' : person.Sesso === 'female' ? 'Femmina' : 'Non specificato'}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {person.DataNascita && (
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>Nascita: {formatDate(person.DataNascita)}</span>
                  </div>
                )}
                {person.DataDecesso && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Decesso: {formatDate(person.DataDecesso)}</span>
                  </div>
                )}
                {person.IdLoculo && (
                  <div className="flex items-center col-span-2 mt-1">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Loculo ID: {person.IdLoculo}</span>
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
