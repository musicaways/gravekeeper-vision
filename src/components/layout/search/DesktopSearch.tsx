
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
    getPlaceholderText 
  } = useSearch({ inputRef, onSearch });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      toast.info(`Ricerca avviata: ${searchTerm}`);
      if (onSearch) onSearch(searchTerm);
    }
  };

  return (
    <div className="flex items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.form
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "250px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mr-1"
            onSubmit={handleSubmit}
          >
            <div className="relative w-full">
              <Input
                ref={inputRef}
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder={getPlaceholderText()}
                className="h-9 pr-8"
                autoComplete="off"
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
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
    </div>
  );
};

export default DesktopSearch;
