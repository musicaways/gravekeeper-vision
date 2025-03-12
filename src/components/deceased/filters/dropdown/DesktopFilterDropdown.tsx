
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import FilterButton from "./FilterButton";
import DesktopFilterContent from "./DesktopFilterContent";
import { FilterDropdownProps } from "./types";

const DesktopFilterDropdown: React.FC<FilterDropdownProps> = (props) => {
  const getFilterLabel = () => {
    const { filterBy, selectedCemetery } = props;
    
    if (selectedCemetery) {
      return `Cimitero: ${selectedCemetery}`;
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FilterButton label={getFilterLabel()} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-background border-muted-foreground/20 w-48">
        <DesktopFilterContent {...props} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DesktopFilterDropdown;
