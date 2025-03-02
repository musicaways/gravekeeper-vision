
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserRound, CalendarIcon, Clock } from "lucide-react";
import { formatDate } from "../deceasedUtils";

interface DeceasedListItemProps {
  person: any;
}

export const DeceasedListItem: React.FC<DeceasedListItemProps> = ({ person }) => {
  return (
    <div className="flex items-start space-x-3 rounded-md border p-3 md:p-4 hover:bg-muted/40 transition-colors">
      <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-primary/10 shrink-0">
        <UserRound className="h-6 w-6 md:h-8 md:w-8 text-primary" />
      </div>
      <div className="space-y-1 md:space-y-2 flex-1 min-w-0">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <h4 className="font-medium text-base md:text-lg leading-tight">{person.Nominativo}</h4>
          {person.Sesso && (
            <Badge variant={person.Sesso === 'male' ? 'default' : person.Sesso === 'female' ? 'secondary' : 'outline'} className="text-xs shrink-0">
              {person.Sesso === 'male' ? 'Maschio' : person.Sesso === 'female' ? 'Femmina' : 'Non specificato'}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground">
          {person.DataNascita && (
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
              <span className="truncate">Nascita: {formatDate(person.DataNascita)}</span>
            </div>
          )}
          {person.DataDecesso && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
              <span className="truncate">Decesso: {formatDate(person.DataDecesso)}</span>
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
