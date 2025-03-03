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
    <div className="relative w-full max-w-[200px]">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-8 h-9 md:w-[200px] lg:w-[280px]"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default DesktopSearch;
