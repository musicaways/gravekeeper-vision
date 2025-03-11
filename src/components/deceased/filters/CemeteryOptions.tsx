
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const fetchCemeteries = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Cimitero')
          .select('Id, Nome')
          .order('Nome');

        if (error) throw error;

        const options = data.map(item => ({
          value: item.Nome,
          label: item.Nome || 'Cimitero senza nome',
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

  const selectedLabel = selectedValue 
    ? cemeteries.find(cemetery => cemetery.value === selectedValue)?.label || selectedValue
    : "Seleziona cimitero";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cerca cimitero..." />
          <CommandEmpty>Nessun cimitero trovato</CommandEmpty>
          <CommandGroup>
            {loading ? (
              <CommandItem disabled>Caricamento...</CommandItem>
            ) : (
              <>
                <CommandItem
                  key="all"
                  value="all"
                  onSelect={() => {
                    onSelectCemetery(null);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !selectedValue ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Tutti i cimiteri
                </CommandItem>

                {cemeteries.map((cemetery) => (
                  <CommandItem
                    key={cemetery.value}
                    value={cemetery.value}
                    onSelect={() => {
                      onSelectCemetery(cemetery.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === cemetery.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {cemetery.label}
                  </CommandItem>
                ))}
              </>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CemeteryOptions;
