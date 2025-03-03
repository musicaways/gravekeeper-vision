
import { useState, useEffect, RefObject, useRef } from "react";
import { useLocation } from "react-router-dom";

interface UseSearchProps {
  inputRef: RefObject<HTMLInputElement>;
  onSearch?: (searchTerm: string) => void;
}

export const useSearch = ({ inputRef, onSearch }: UseSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  
  const getPlaceholderText = () => {
    if (location.pathname.includes("/cemetery/")) {
      return "Cerca settori, tombe o documenti...";
    } else if (location.pathname === "/cemeteries") {
      return "Cerca cimiteri per nome, città o indirizzo...";
    } else if (location.pathname === "/work-orders") {
      return "Cerca ordini di lavoro...";
    } else if (location.pathname.includes("/documents")) {
      return "Cerca documenti...";
    } else if (location.pathname === "/settings") {
      return "Cerca impostazioni...";
    } else {
      return "Cerca...";
    }
  };
  
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    
    // Focus input after opening
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, inputRef]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
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
    setIsOpen(false);
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };
  
  // Close search on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);
  
  // Handle clicks outside search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
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
    getPlaceholderText,
    searchContainerRef
  };
};
