
import React from "react";
import { Check, MapPin } from "lucide-react";
import { 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import CemeteryOptions from "../cemetery";
import { FilterDropdownProps } from "./types";

const DesktopFilterContent: React.FC<FilterDropdownProps> = ({
  filterBy,
  selectedCemetery,
  onFilterChange,
  onCemeterySelect
}) => {
  // Function to handle cemetery selection
  const handleCemeterySelect = (cemeteryName: string | null) => {
    console.log("DesktopFilterContent - Cemetery selected:", cemeteryName);
    onCemeterySelect(cemeteryName);
    
    if (!cemeteryName && filterBy === 'by-cemetery') {
      console.log("DesktopFilterContent - Resetting filter to all");
      onFilterChange('all');
    }
  };

  return (
    <>
      <DropdownMenuItem 
        className={`text-xs ${filterBy === 'all' && !selectedCemetery ? 'bg-muted text-primary' : ''}`}
        onClick={() => {
          onFilterChange('all');
          onCemeterySelect(null);
        }}
      >
        Tutti
      </DropdownMenuItem>
      <DropdownMenuItem 
        className={`text-xs ${filterBy === 'recent' && !selectedCemetery ? 'bg-muted text-primary' : ''}`}
        onClick={() => {
          onFilterChange('recent');
          onCemeterySelect(null);
        }}
      >
        Recenti (30 giorni)
      </DropdownMenuItem>
      <DropdownMenuItem 
        className={`text-xs ${filterBy === 'this-year' && !selectedCemetery ? 'bg-muted text-primary' : ''}`}
        onClick={() => {
          onFilterChange('this-year');
          onCemeterySelect(null);
        }}
      >
        Quest'anno
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuSub>
        <DropdownMenuSubTrigger 
          className={`text-xs ${selectedCemetery ? 'bg-muted text-primary' : ''}`}
        >
          <MapPin className="h-3.5 w-3.5 mr-2" />
          Filtra per cimitero
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="bg-background border-muted-foreground/20 text-xs">
            <CemeteryOptions 
              onSelectCemetery={handleCemeterySelect}
              selectedValue={selectedCemetery}
            />
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </>
  );
};

export default DesktopFilterContent;
