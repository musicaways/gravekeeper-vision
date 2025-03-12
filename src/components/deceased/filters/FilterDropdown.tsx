
import React from "react";
import { Filter, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CemeteryOptions from "./CemeteryOptions";

interface FilterDropdownProps {
  filterBy: string;
  selectedCemetery: string | null;
  onFilterChange: (filterType: string) => void;
  onCemeterySelect: (value: string | null) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  filterBy, 
  selectedCemetery, 
  onFilterChange, 
  onCemeterySelect 
}) => {
  const isMobile = useIsMobile();
  
  const getFilterLabel = () => {
    if (filterBy === 'by-cemetery' && selectedCemetery) {
      return `${isMobile ? '' : 'Cimitero: '}${selectedCemetery}`;
    }

    switch (filterBy) {
      case 'all':
        return 'Tutti';
      case 'recent':
        return 'Recenti (30g)';
      case 'this-year':
        return 'Quest\'anno';
      case 'by-cemetery':
        return 'Seleziona cimitero';
      default:
        return 'Filtra';
    }
  };

  // Mobile version uses Sheet instead of dropdown for more space
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs font-normal px-3 border-muted-foreground/20 text-muted-foreground hover:text-foreground w-[130px] truncate"
          >
            <Filter className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{getFilterLabel()}</span>
            <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70 flex-shrink-0" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="px-1 pb-8 pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Filtra per</h3>
            
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant={filterBy === 'all' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onFilterChange('all')}
              >
                Tutti
              </Button>
              
              <Button 
                variant={filterBy === 'recent' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onFilterChange('recent')}
              >
                Recenti (30 giorni)
              </Button>
              
              <Button 
                variant={filterBy === 'this-year' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onFilterChange('this-year')}
              >
                Quest'anno
              </Button>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-2" />
                Filtra per cimitero
              </h4>
              <CemeteryOptions 
                onSelectCemetery={onCemeterySelect}
                selectedValue={selectedCemetery}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version with dropdown
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
                onSelectCemetery={onCemeterySelect}
                selectedValue={selectedCemetery}
              />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
