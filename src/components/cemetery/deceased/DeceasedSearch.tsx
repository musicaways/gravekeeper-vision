
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
    <div className="mb-4 space-y-3">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cerca defunto per nome..."
          className="w-full pl-9 pr-9 h-10"
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
      
      <Button onClick={onAddClick} className="w-full sm:w-auto flex items-center justify-center gap-2 h-10">
        <PlusCircle className="h-4 w-4" />
        <span>Aggiungi defunto</span>
      </Button>
    </div>
  );
};
