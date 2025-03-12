
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import FilterButton from "./FilterButton";
import MobileFilterContent from "./MobileFilterContent";
import { FilterDropdownProps } from "./types";

const MobileFilterDropdown: React.FC<FilterDropdownProps> = (props) => {
  const getFilterLabel = () => {
    const { filterBy, selectedCemetery } = props;
    
    if (selectedCemetery) {
      return selectedCemetery;
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
    <Sheet>
      <SheetTrigger asChild>
        <FilterButton label={getFilterLabel()} />
      </SheetTrigger>
      <SheetContent side="bottom" className="px-1 pb-8 pt-6">
        <MobileFilterContent {...props} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterDropdown;
