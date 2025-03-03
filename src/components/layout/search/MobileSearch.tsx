import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface MobileSearchProps {
  onSearch?: (searchTerm: string) => void;
  value?: string;
}

const MobileSearch = ({ onSearch, value = "" }: MobileSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (onSearch) {
      onSearch(newValue);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    setOpen(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="max-h-40 pt-10">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={handleSearch}
              autoFocus
            />
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSearch;
