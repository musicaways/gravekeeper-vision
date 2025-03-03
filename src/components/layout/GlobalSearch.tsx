
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  
  // Get placeholder text based on current route
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
    setIsOpen(prev => !prev);
    if (!isOpen && inputRef.current) {
      // Focus input when opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };
  
  const closeSearch = () => {
    setIsOpen(false);
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };
  
  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Reset search when route changes
  useEffect(() => {
    setSearchTerm("");
    setIsOpen(false);
    if (onSearch) {
      onSearch("");
    }
  }, [location.pathname, onSearch]);
  
  return (
    <div ref={searchRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSearch}
        aria-label="Cerca"
        className="relative transition-all duration-200 hover:bg-accent"
      >
        <Search className="h-5 w-5 text-muted-foreground" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-1 bg-card shadow-lg rounded-md border z-50 p-2 origin-top-right md:w-[280px] w-[calc(100vw-1rem)] -right-2 sm:right-0"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder={getPlaceholderText()}
                  className="w-full pl-9 pr-8 h-9 text-sm"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => {
                      setSearchTerm("");
                      if (onSearch) onSearch("");
                      inputRef.current?.focus();
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={closeSearch}
                className="h-9 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
