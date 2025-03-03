
import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "@/hooks/use-search";

interface MobileSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const MobileSearch = ({ onSearch }: MobileSearchProps) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    isOpen, 
    searchTerm, 
    toggleSearch, 
    handleSearch, 
    clearSearch,
    closeSearch, 
    getPlaceholderText 
  } = useSearch({ inputRef, onSearch });

  // Handle clicks outside the search bar
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
  }, [isOpen, closeSearch]);

  return (
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
      
      <AnimatePresence initial={false}>
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
                      clearSearch();
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
};

export default MobileSearch;
