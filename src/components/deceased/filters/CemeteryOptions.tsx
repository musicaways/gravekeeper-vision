
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
  id: number;
}

interface CemeteryOptionsProps {
  onSelectCemetery: (value: string | null, cemeteryId?: number | null) => void;
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
        const { data, error } = await supabase
          .from('Cimitero')
          .select('Id, Nome')
          .order('Nome');

        if (error) throw error;

        // Log per debug
        console.log("CemeteryOptions - Fetched cemeteries:", data);

        const options = data.map(item => ({
          value: item.Nome,
          label: item.Nome || 'Cimitero senza nome',
          id: item.Id
        }));

        setCemeteries(options);
      } catch (error) {
        console.error("Error fetching cemeteries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteries();
  }, []);

  // Trova il cimitero selezionato
  const selectedCemetery = selectedValue 
    ? cemeteries.find(cemetery => {
        const cemeteryValue = cemetery.value.toLowerCase().trim();
        const selectedValueLower = selectedValue.toLowerCase().trim();
        
        return cemeteryValue === selectedValueLower || 
               cemeteryValue.includes(selectedValueLower) || 
               selectedValueLower.includes(cemeteryValue);
      })
    : null;

  const selectedLabel = selectedCemetery?.label || selectedValue || "Seleziona cimitero";
  const selectedId = selectedCemetery?.id || null;

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
            onClick={() => onSelectCemetery(null, null)}
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
                key={cemetery.id}
                className="text-xs"
                onClick={() => {
                  console.log("Selected cemetery:", cemetery);
                  onSelectCemetery(cemetery.value, cemetery.id);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-3.5 w-3.5",
                    selectedCemetery?.id === cemetery.id ? "opacity-100" : "opacity-0"
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
          >
            {selectedLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem 
            className="font-medium"
            onClick={() => onSelectCemetery(null, null)}
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
                key={cemetery.id}
                onClick={() => {
                  console.log("Selected cemetery:", cemetery);
                  onSelectCemetery(cemetery.value, cemetery.id);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCemetery?.id === cemetery.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {cemetery.label}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CemeteryOptions;
