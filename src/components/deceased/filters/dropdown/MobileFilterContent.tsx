
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import CemeteryOptions from "../cemetery";
import { FilterDropdownProps } from "./types";

const MobileFilterContent: React.FC<FilterDropdownProps> = ({
  filterBy,
  selectedCemetery,
  onFilterChange,
  onCemeterySelect
}) => {
  console.log("MobileFilterContent rendering with:", { filterBy, selectedCemetery });
  
  // Function to handle cemetery selection
  const handleCemeterySelect = (cemeteryName: string | null) => {
    console.log("MobileFilterContent - Cemetery selected:", cemeteryName);
    onCemeterySelect(cemeteryName);
    
    if (!cemeteryName && filterBy === 'by-cemetery') {
      console.log("MobileFilterContent - Resetting filter to all");
      onFilterChange('all');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Filtra per</h3>
      
      <div className="grid grid-cols-1 gap-2">
        <Button 
          variant={filterBy === 'all' && !selectedCemetery ? "default" : "outline"}
          size="sm"
          className="justify-start"
          onClick={() => {
            console.log("MobileFilterContent - Selected 'all' filter");
            onFilterChange('all');
            onCemeterySelect(null);
          }}
        >
          Tutti
        </Button>
        
        <Button 
          variant={filterBy === 'recent' && !selectedCemetery ? "default" : "outline"}
          size="sm"
          className="justify-start"
          onClick={() => {
            console.log("MobileFilterContent - Selected 'recent' filter");
            onFilterChange('recent');
            onCemeterySelect(null);
          }}
        >
          Recenti (30 giorni)
        </Button>
        
        <Button 
          variant={filterBy === 'this-year' && !selectedCemetery ? "default" : "outline"}
          size="sm"
          className="justify-start"
          onClick={() => {
            console.log("MobileFilterContent - Selected 'this-year' filter");
            onFilterChange('this-year');
            onCemeterySelect(null);
          }}
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
          onSelectCemetery={handleCemeterySelect}
          selectedValue={selectedCemetery}
        />
      </div>
    </div>
  );
};

export default MobileFilterContent;
