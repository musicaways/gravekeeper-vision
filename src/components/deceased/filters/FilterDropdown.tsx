import React from "react";
import { Filter, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import CemeteryOptions from "./CemeteryOptions";

interface FilterDropdownProps {
  filterBy: string;
  selectedCemetery: string | null;
  onFilterChange: (filterType: string) => void;
  onCemeterySelect: (cemeteryName: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  filterBy, 
  selectedCemetery, 
  onFilterChange, 
  onCemeterySelect 
}) => {
  const getFilterLabel = () => {
    if (filterBy === 'by-cemetery' && selectedCemetery) {
      return `Cimitero: ${selectedCemetery}`;
    }

    switch (filterBy) {
      case 'all':
        return 'Tutti';
      case 'recent':
        return 'Recenti (30 giorni)';
      case 'this-year':
        return 'Quest\'anno';
      case 'by-cemetery':
        return 'Seleziona cimitero';
      default:
        return 'Filtra';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs font-normal px-3 border-muted-foreground/20 text-muted-foreground hover:text-foreground"
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          {getFilterLabel()}
          <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-background border-muted-foreground/20 w-48">
        <DropdownMenuItem 
          className={`text-xs ${filterBy === 'all' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Tutti
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`text-xs ${filterBy === 'recent' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onFilterChange('recent')}
        >
          Recenti (30 giorni)
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`text-xs ${filterBy === 'this-year' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onFilterChange('this-year')}
        >
          Quest'anno
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger 
            className={`text-xs ${filterBy === 'by-cemetery' ? 'bg-muted text-primary' : ''}`}
          >
            <MapPin className="h-3.5 w-3.5 mr-2" />
            Filtra per cimitero
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-background border-muted-foreground/20 text-xs">
              <CemeteryOptions 
                onCemeterySelect={onCemeterySelect} 
                selectedCemetery={selectedCemetery} 
              />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
