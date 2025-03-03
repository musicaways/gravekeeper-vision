
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { toast } = useToast();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  // Handle window resize to detect desktop/mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  }, [isOpen]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("Search term updated:", value);
    if (onSearch) {
      onSearch(value);
    }
  };
  
  const closeSearch = () => {
    console.log("Closing search");
    setIsOpen(false);
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  
  useEffect(() => {
    setSearchTerm("");
    setIsOpen(false);
    if (onSearch) {
      onSearch("");
    }
  }, [location.pathname, onSearch]);
  
  // Desktop search bar component
  const DesktopSearch = () => (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSearch}
        aria-label="Cerca"
        className="relative transition-all duration-200 hover:bg-accent"
        type="button"
      >
        <Search className="h-5 w-5 text-muted-foreground" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "250px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute right-12 top-1/2 -translate-y-1/2 h-9"
          >
            <div className="relative w-full h-full">
              <Input
                ref={inputRef}
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder={getPlaceholderText()}
                className="w-full h-full pr-10 rounded-md"
                autoComplete="off"
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => {
                    setSearchTerm("");
                    if (onSearch) onSearch("");
                    inputRef.current?.focus();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
  
  // Mobile search bar component - preserved from original implementation
  const MobileSearch = () => (
    <div ref={searchRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSearch}
        aria-label="Cerca"
        className="relative transition-all duration-200 hover:bg-accent"
        type="button"
      >
        <Search className="h-5 w-5 text-muted-foreground" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed md:absolute bg-card shadow-lg border rounded-lg z-50 origin-top-right top-12 md:top-full left-0 md:right-0 w-full md:w-[350px]"
          >
            <div className="px-4 py-3">
              <div className="relative flex w-full items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder={getPlaceholderText()}
                  className="w-full pl-10 pr-10 h-10 text-sm rounded-md"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-8 w-8"
                  onClick={() => {
                    if (searchTerm) {
                      setSearchTerm("");
                      if (onSearch) onSearch("");
                      inputRef.current?.focus();
                    } else {
                      closeSearch();
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  // Render desktop or mobile search based on screen width
  return isDesktop ? <DesktopSearch /> : <MobileSearch />;
};

export default GlobalSearch;
