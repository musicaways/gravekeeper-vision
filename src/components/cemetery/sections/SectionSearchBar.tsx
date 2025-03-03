
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Plus, Search } from "lucide-react";

interface SectionSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SectionSearchBar: React.FC<SectionSearchBarProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="flex justify-between items-center mb-6 gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca settori..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline">Esporta</span>
        </Button>
        <Button size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuovo Settore</span>
        </Button>
      </div>
    </div>
  );
};
