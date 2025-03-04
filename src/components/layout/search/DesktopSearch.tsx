
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DesktopSearchProps {
  onSearch?: (searchTerm: string) => void;
  value?: string;
}

const DesktopSearch = ({ onSearch, value = "" }: DesktopSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  
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
  
  return (
    <div className="relative w-full max-w-[200px] group">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary/70 transition-colors duration-200" />
      <Input
        type="search"
        placeholder="Cerca..."
        className="pl-8 h-8 md:w-[180px] lg:w-[220px] rounded-lg border-muted focus:border-primary/50 transition-all duration-300 text-sm"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default DesktopSearch;
