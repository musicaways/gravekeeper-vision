
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface DeceasedListEmptyProps {
  onAddClick: () => void;
}

export const DeceasedListEmpty: React.FC<DeceasedListEmptyProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-10">
      <p className="text-muted-foreground">Nessun defunto registrato per questo cimitero</p>
      <Button variant="outline" className="mt-4" onClick={onAddClick}>
        <UserPlus className="mr-2 h-4 w-4" />
        Aggiungi un nuovo defunto
      </Button>
    </div>
  );
};
