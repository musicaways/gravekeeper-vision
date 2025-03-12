
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CemeteryOption, CemeteryOptionsProps } from "./types";

interface DesktopCemeteryOptionsProps extends CemeteryOptionsProps {
  loading: boolean;
  cemeteries: CemeteryOption[];
}

const DesktopCemeteryOptions: React.FC<DesktopCemeteryOptionsProps> = ({
  loading,
  cemeteries,
  selectedValue,
  onSelectCemetery
}) => {
  return (
    <div className="w-full">
      <DropdownMenuItem 
        className="font-medium"
        onClick={() => onSelectCemetery(null)}
      >
        <Check className={cn("mr-2 h-4 w-4", !selectedValue ? "opacity-100" : "opacity-0")} />
        Tutti i cimiteri
      </DropdownMenuItem>
      
      {loading ? (
        <DropdownMenuItem disabled>
          Caricamento...
        </DropdownMenuItem>
      ) : (
        cemeteries.map((cemetery) => (
          <DropdownMenuItem
            key={cemetery.value}
            onClick={() => onSelectCemetery(cemetery.value)}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selectedValue === cemetery.value ? "opacity-100" : "opacity-0"
              )}
            />
            {cemetery.label}
          </DropdownMenuItem>
        ))
      )}
    </div>
  );
};

export default DesktopCemeteryOptions;
