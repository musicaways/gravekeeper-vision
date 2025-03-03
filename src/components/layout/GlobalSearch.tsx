
import { useState, useEffect } from "react";
import DesktopSearch from "./search/DesktopSearch";
import MobileSearch from "./search/MobileSearch";
import { useIsMobile } from "@/hooks/use-mobile";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const isMobile = useIsMobile();
  
  return isMobile ? 
    <MobileSearch onSearch={onSearch} /> : 
    <DesktopSearch onSearch={onSearch} />;
};

export default GlobalSearch;
