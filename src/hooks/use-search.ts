
import { useState, useEffect, RefObject } from "react";
import { useLocation } from "react-router-dom";

interface UseSearchProps {
  inputRef: RefObject<HTMLInputElement>;
  onSearch?: (searchTerm: string) => void;
}

export const useSearch = ({ inputRef, onSearch }: UseSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  
  const getPlaceholderText = () => {
    if (location.pathname.includes("/cemetery/")) {
      return "Cerca settori, tombe o documenti...";
    } else if (location.pathname === "/cemeteries") {
      return "Cerca cimiteri per nome, città o indirizzo...";
    } else if (location.pathname === "/work-orders") {
      return "Cerca ordini di lavoro...";
    } else if (location.pathname.includes("/documents")) {
      return "Cerca documenti...";
    } else {
      return "Cerca...";
    }
  };
  
  const toggleSearch = () => {
    console.log("Toggle search clicked, current state:", isOpen);
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      console.log("Search is open, focusing input");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, inputRef]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("Search term updated:", value);
    if (onSearch) {
      onSearch(value);
    }
  };
  
  const clearSearch = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
    inputRef.current?.focus();
  };
  
  const closeSearch = () => {
    console.log("Closing search");
    setIsOpen(false);
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };
  
  // Reset search when location changes
  useEffect(() => {
    setSearchTerm("");
    setIsOpen(false);
    if (onSearch) {
      onSearch("");
    }
  }, [location.pathname, onSearch]);
  
  return {
    isOpen,
    searchTerm,
    toggleSearch,
    handleSearch,
    clearSearch,
    closeSearch,
    getPlaceholderText
  };
};
