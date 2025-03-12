
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown } from "lucide-react";

interface FilterButtonProps {
  label: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-xs font-normal px-3 border-muted-foreground/20 text-muted-foreground hover:text-foreground w-[130px] truncate"
    >
      <Filter className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
      <span className="truncate">{label}</span>
      <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70 flex-shrink-0" />
    </Button>
  );
};

export default FilterButton;
