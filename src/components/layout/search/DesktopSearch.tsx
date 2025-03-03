
import { useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "@/hooks/use-search";
import { toast } from "sonner";

interface DesktopSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const DesktopSearch = ({ onSearch }: DesktopSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { 
    isOpen, 
    searchTerm, 
    toggleSearch, 
    handleSearch, 
    clearSearch,
    closeSearch,
    getPlaceholderText,
    searchContainerRef
  } = useSearch({ inputRef, onSearch });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      toast.info(`Ricerca avviata: ${searchTerm}`);
      if (onSearch) onSearch(searchTerm);
    }
    // Close search after submitting
    closeSearch();
  };

  return (
    <div className="flex items-center">
      <AnimatePresence>
        {isOpen ? (
          <motion.form
            ref={searchContainerRef}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "300px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mr-1"
            onSubmit={handleSubmit}
          >
            <div className="relative w-full flex items-center">
              <div className="relative flex-1 group">
                <Input
                  ref={inputRef}
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder={getPlaceholderText()}
                  className="h-9 pr-16 pl-3 border border-input/80 focus-visible:ring-1 transition-all rounded-l-md rounded-r-none"
                  autoComplete="off"
                />
                <div className="absolute right-0 top-0 h-full flex items-center">
                  {searchTerm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mr-1"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="h-9 rounded-l-none rounded-r-md border border-l-0 border-input/80 bg-accent/30 hover:bg-accent/50 px-3"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </motion.form>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            aria-label="Cerca"
            className="hover:bg-accent"
            type="button"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopSearch;
