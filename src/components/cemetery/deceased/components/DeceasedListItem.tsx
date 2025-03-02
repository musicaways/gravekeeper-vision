
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserRound, CalendarIcon, Clock } from "lucide-react";
import { formatDate } from "../deceasedUtils";

interface DeceasedListItemProps {
  person: any;
}

export const DeceasedListItem: React.FC<DeceasedListItemProps> = ({ person }) => {
  return (
    <div className="flex items-start space-x-4 rounded-md border p-4 hover:bg-muted/40 transition-colors">
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
  );
};
