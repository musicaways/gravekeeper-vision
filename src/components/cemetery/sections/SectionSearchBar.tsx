
import React from "react";

interface SectionSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

// This component is no longer used as per requirements
export const SectionSearchBar: React.FC<SectionSearchBarProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return null;
};
