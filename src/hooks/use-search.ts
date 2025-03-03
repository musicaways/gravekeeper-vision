
import { useState, useEffect, RefObject, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface UseSearchProps {
  inputRef: RefObject<HTMLInputElement>;
  onSearch?: (searchTerm: string) => void;
}

export const useSearch = ({ inputRef, onSearch }: UseSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const searchContainerRef = useRef<HTMLFormElement | null>(null);
  
  const getPlaceholderText = useCallback(() => {
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
  }, [location.pathname]);
  
  const toggleSearch = useCallback(() => {
    setIsOpen(prevState => {
      const newState = !prevState;
      
      // Focus input after opening
      if (newState && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
      
      return newState;
    });
  }, [inputRef]);
  
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);
  
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
    inputRef.current?.focus();
  }, [inputRef, onSearch]);
  
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  }, [onSearch]);
  
  // Focus input when opening search
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, inputRef]);
  
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
  }, [isOpen, closeSearch]);
  
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
  }, [isOpen, closeSearch]);
  
  // Reset search when route changes completely
  useEffect(() => {
    const currentMainPath = location.pathname.split('/')[1];
    return () => {
      const newMainPath = window.location.pathname.split('/')[1];
      if (currentMainPath !== newMainPath) {
        setSearchTerm("");
        setIsOpen(false);
        if (onSearch) {
          onSearch("");
        }
      }
    };
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
