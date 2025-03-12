
import React from "react";
import { ArrowDownAZ, ArrowUpAZ, Calendar, Building, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SortDropdownProps {
  sortBy: string;
  onSortChange: (sortType: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, onSortChange }) => {
  const isMobile = useIsMobile();
  
  const getSortLabel = () => {
    switch (sortBy) {
      case 'name-asc':
        return 'Nome (A-Z)';
      case 'name-desc':
        return 'Nome (Z-A)';
      case 'date-desc':
        return 'Data decesso (recenti)';
      case 'date-asc':
        return 'Data decesso (meno recenti)';
      case 'cemetery-asc':
        return 'Cimitero (A-Z)';
      case 'cemetery-desc':
        return 'Cimitero (Z-A)';
      default:
        return 'Ordina';
    }
  };

  // Mobile version uses Sheet
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs font-normal px-3 border-muted-foreground/20 text-muted-foreground hover:text-foreground w-[140px] truncate"
          >
            <ArrowUpAZ className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{getSortLabel()}</span>
            <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70 flex-shrink-0" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="px-1 pb-8 pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Ordina per</h3>
            
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant={sortBy === 'name-asc' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onSortChange('name-asc')}
              >
                <ArrowUpAZ className="h-3.5 w-3.5 mr-2" />
                Nome (A-Z)
              </Button>
              
              <Button 
                variant={sortBy === 'name-desc' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onSortChange('name-desc')}
              >
                <ArrowDownAZ className="h-3.5 w-3.5 mr-2" />
                Nome (Z-A)
              </Button>
              
              <Button 
                variant={sortBy === 'date-desc' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onSortChange('date-desc')}
              >
                <Calendar className="h-3.5 w-3.5 mr-2" />
                Data decesso (recenti)
              </Button>
              
              <Button 
                variant={sortBy === 'date-asc' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onSortChange('date-asc')}
              >
                <Calendar className="h-3.5 w-3.5 mr-2" />
                Data decesso (meno recenti)
              </Button>
              
              <Button 
                variant={sortBy === 'cemetery-asc' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onSortChange('cemetery-asc')}
              >
                <Building className="h-3.5 w-3.5 mr-2" />
                Cimitero (A-Z)
              </Button>
              
              <Button 
                variant={sortBy === 'cemetery-desc' ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => onSortChange('cemetery-desc')}
              >
                <Building className="h-3.5 w-3.5 mr-2" />
                Cimitero (Z-A)
              </Button>
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
          <ArrowUpAZ className="h-3.5 w-3.5 mr-1" />
          {getSortLabel()}
          <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-background border-muted-foreground/20 w-48">
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
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'date-desc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('date-desc')}
        >
          <Calendar className="h-3.5 w-3.5 mr-2" />
          Data decesso (recenti)
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'date-asc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('date-asc')}
        >
          <Calendar className="h-3.5 w-3.5 mr-2" />
          Data decesso (meno recenti)
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'cemetery-asc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('cemetery-asc')}
        >
          <Building className="h-3.5 w-3.5 mr-2" />
          Cimitero (A-Z)
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`text-xs ${sortBy === 'cemetery-desc' ? 'bg-muted text-primary' : ''}`}
          onClick={() => onSortChange('cemetery-desc')}
        >
          <Building className="h-3.5 w-3.5 mr-2" />
          Cimitero (Z-A)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
