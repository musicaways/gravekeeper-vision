
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, X } from "lucide-react";

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
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cerca defunto per nome..."
          className="w-full pl-9 pr-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            aria-label="Cancella ricerca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <Button onClick={onAddClick} className="whitespace-nowrap">
        <PlusCircle className="mr-2 h-4 w-4" />
        Aggiungi defunto
      </Button>
    </div>
  );
};
