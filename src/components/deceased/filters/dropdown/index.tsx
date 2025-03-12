
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFilterDropdown from "./MobileFilterDropdown";
import DesktopFilterDropdown from "./DesktopFilterDropdown";
import { FilterDropdownProps } from "./types";

const FilterDropdown: React.FC<FilterDropdownProps> = (props) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileFilterDropdown {...props} />;
  }

  return <DesktopFilterDropdown {...props} />;
};

export default FilterDropdown;
