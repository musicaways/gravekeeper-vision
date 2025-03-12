
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CemeteryOption, CemeteryOptionsProps } from "./types";

interface MobileCemeteryOptionsProps extends CemeteryOptionsProps {
  loading: boolean;
  cemeteries: CemeteryOption[];
  selectedLabel: string;
}

const MobileCemeteryOptions: React.FC<MobileCemeteryOptionsProps> = ({
  loading,
  cemeteries,
  selectedValue,
  selectedLabel,
  onSelectCemetery
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-xs">
          {selectedLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem 
          className="text-xs font-medium"
          onClick={() => onSelectCemetery(null)}
        >
          <Check className={cn("mr-2 h-3.5 w-3.5", !selectedValue ? "opacity-100" : "opacity-0")} />
          Tutti i cimiteri
        </DropdownMenuItem>
        
        {loading ? (
          <DropdownMenuItem disabled className="text-xs">
            Caricamento...
          </DropdownMenuItem>
        ) : (
          cemeteries.map((cemetery) => (
            <DropdownMenuItem
              key={cemetery.value}
              className="text-xs"
              onClick={() => onSelectCemetery(cemetery.value)}
            >
              <Check
                className={cn(
                  "mr-2 h-3.5 w-3.5",
                  selectedValue === cemetery.value ? "opacity-100" : "opacity-0"
                )}
              />
              {cemetery.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileCemeteryOptions;
