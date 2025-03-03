
import { useState, useEffect } from "react";
import DesktopSearch from "./search/DesktopSearch";
import MobileSearch from "./search/MobileSearch";
import { useMobile } from "@/hooks/use-mobile";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const isMobile = useMobile();
  
  return isMobile ? 
    <MobileSearch onSearch={onSearch} /> : 
    <DesktopSearch onSearch={onSearch} />;
};

export default GlobalSearch;
