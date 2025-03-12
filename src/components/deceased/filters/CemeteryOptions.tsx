
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CemeteryOption {
  value: string;
  label: string;
}

interface CemeteryOptionsProps {
  onSelectCemetery: (value: string | null) => void;
  selectedValue: string | null;
}

const CemeteryOptions: React.FC<CemeteryOptionsProps> = ({
  onSelectCemetery,
  selectedValue,
}) => {
  const [open, setOpen] = useState(false);
  const [cemeteries, setCemeteries] = useState<CemeteryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCemeteries = async () => {
      try {
        setLoading(true);
        console.log("Fetching cemetery options...");
        
        const { data, error } = await supabase
          .from('Cimitero')
          .select('Id, Nome')
          .order('Nome');

        if (error) throw error;

        console.log("Received cemetery data:", data);
        
        const options = data.map(item => ({
          value: item.Nome,
          label: item.Nome || 'Cimitero senza nome',
        }));

        console.log("Processed cemetery options:", options);
        setCemeteries(options);
      } catch (error) {
        console.error("Error fetching cemeteries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteries();
  }, []);

  const selectedLabel = selectedValue 
    ? cemeteries.find(cemetery => cemetery.value === selectedValue)?.label || selectedValue
    : "Seleziona cimitero";

  console.log("CemeteryOptions - Current selection:", selectedValue, "Label:", selectedLabel);

  // Simple dropdown for mobile to avoid Command component issues
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between text-xs"
          >
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
  }

  // Desktop version with Popover + Command
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

export default CemeteryOptions;
