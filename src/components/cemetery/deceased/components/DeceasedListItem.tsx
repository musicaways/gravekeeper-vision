
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserRound, CalendarIcon, Clock } from "lucide-react";
import { formatDate } from "../deceasedUtils";

interface DeceasedListItemProps {
  person: any;
}

export const DeceasedListItem: React.FC<DeceasedListItemProps> = ({ person }) => {
  return (
    <div className="flex items-start space-x-3 rounded-md border p-3 hover:bg-muted/40 transition-colors">
      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
        <UserRound className="h-5 w-5 md:h-6 md:w-6 text-primary" />
      </div>
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex justify-between items-start flex-wrap gap-1">
          <h4 className="font-medium text-base leading-tight">{person.Nominativo}</h4>
          {person.Sesso && (
            <Badge variant={person.Sesso === 'male' ? 'default' : person.Sesso === 'female' ? 'secondary' : 'outline'} className="text-xs shrink-0">
              {person.Sesso === 'male' ? 'M' : person.Sesso === 'female' ? 'F' : 'N/S'}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {person.DataNascita && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3 shrink-0" />
              <span className="truncate">Nascita: {formatDate(person.DataNascita)}</span>
            </div>
          )}
          {person.DataDecesso && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">Decesso: {formatDate(person.DataDecesso)}</span>
            </div>
          )}
          {person.IdLoculo && (
            <div className="flex items-center col-span-2 mt-1">
              <span className="text-xs bg-muted px-2 py-0.5 rounded">Loculo: {person.IdLoculo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
