
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";

interface DeceasedSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export const DeceasedSearch: React.FC<DeceasedSearchProps> = ({
  searchTerm,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cerca defunto..."
          className="w-full pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Button onClick={onAddClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Aggiungi defunto
      </Button>
    </div>
  );
};
