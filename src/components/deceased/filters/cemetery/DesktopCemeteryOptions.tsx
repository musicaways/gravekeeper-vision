
import React from "react";
import { Check } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CemeteryOption } from "./types";

interface DesktopCemeteryOptionsProps {
  loading: boolean;
  cemeteries: CemeteryOption[];
  selectedValue: string | null;
  onSelectCemetery: (value: string | null) => void;
}

const DesktopCemeteryOptions: React.FC<DesktopCemeteryOptionsProps> = ({
  loading,
  cemeteries,
  selectedValue,
  onSelectCemetery
}) => {
  if (loading) {
    return <DropdownMenuItem disabled>Caricamento cimiteri...</DropdownMenuItem>;
  }

  if (cemeteries.length === 0) {
    return <DropdownMenuItem disabled>Nessun cimitero disponibile</DropdownMenuItem>;
  }

  return (
    <>
      {/* Opzione per cancellare la selezione */}
      <DropdownMenuItem 
        className="text-xs"
        onClick={() => onSelectCemetery(null)}
      >
        <span className="mr-auto">Nessun cimitero</span>
        {selectedValue === null && <Check className="h-4 w-4 ml-2" />}
      </DropdownMenuItem>
      
      {/* Lista dei cimiteri */}
      {cemeteries.map((cemetery) => (
        <DropdownMenuItem 
          key={cemetery.value} 
          className="text-xs"
          onClick={() => onSelectCemetery(cemetery.value)}
        >
          <span className="mr-auto truncate max-w-[160px]">{cemetery.label}</span>
          {selectedValue === cemetery.value && <Check className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default DesktopCemeteryOptions;
