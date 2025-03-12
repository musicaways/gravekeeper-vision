
import { useState, useEffect, KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface MobileSearchProps {
  onSearch?: (searchTerm: string, shouldNavigate?: boolean) => void;
  value?: string;
}

const MobileSearch = ({ onSearch, value = "" }: MobileSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };
  
  const handleClear = () => {
    setSearchTerm("");
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onSearch) {
        onSearch(searchTerm, true);
        setOpen(false);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, true);
    }
    setOpen(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary/70 transition-colors">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="max-h-40 pt-10 animate-slide-in-top bg-background/95 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cerca e premi Invio..."
              className="pl-9 pr-9 w-full rounded-lg border-muted focus:border-primary/50 transition-all duration-300 text-sm"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {searchTerm && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSearch;
