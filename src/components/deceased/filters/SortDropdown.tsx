
import React from "react";
import { SlidersHorizontal, ChevronDown, ArrowUpAZ, ArrowDownAZ, Calendar, MapPin, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortDropdownProps {
  sortBy: string;
  onSortChange: (sortType: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, onSortChange }) => {
  // Helper function to get the active sort option label
  const getSortLabel = () => {
    switch (sortBy) {
      case 'name-asc':
        return 'Nome (A-Z)';
      case 'name-desc':
        return 'Nome (Z-A)';
      case 'date-desc':
        return 'Data decesso (Recente)';
      case 'date-asc':
        return 'Data decesso (Meno recente)';
      case 'cemetery-asc':
        return 'Cimitero (A-Z)';
      case 'cemetery-desc':
        return 'Cimitero (Z-A)';
      default:
        return 'Ordina per';
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
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
          {getSortLabel()}
          <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-background border-muted-foreground/20 w-56">
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'name-asc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('name-asc')}
        >
          <ArrowUpAZ className="h-3.5 w-3.5 mr-2" />
          Nome (A-Z)
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'name-desc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('name-desc')}
        >
          <ArrowDownAZ className="h-3.5 w-3.5 mr-2" />
          Nome (Z-A)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'date-desc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('date-desc')}
        >
          <Calendar className="h-3.5 w-3.5 mr-2" />
          Data decesso (Più recente)
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'date-asc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('date-asc')}
        >
          <CalendarClock className="h-3.5 w-3.5 mr-2" />
          Data decesso (Meno recente)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'cemetery-asc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('cemetery-asc')}
        >
          <MapPin className="h-3.5 w-3.5 mr-2" />
          Cimitero (A-Z)
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'cemetery-desc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('cemetery-desc')}
        >
          <MapPin className="h-3.5 w-3.5 mr-2" />
          Cimitero (Z-A)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
