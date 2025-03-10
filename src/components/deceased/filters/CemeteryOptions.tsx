
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface CemeteryOptionsProps {
  onCemeterySelect: (name: string) => void;
  selectedCemetery: string | null;
}

const CemeteryOptions: React.FC<CemeteryOptionsProps> = ({ 
  onCemeterySelect, 
  selectedCemetery 
}) => {
  const [cemeteries, setCemeteries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract unique cemetery names from the deceased list
    const fetchCemeteries = async () => {
      try {
        const { data, error } = await supabase
          .from('defunti')
          .select(`
            loculi (
              Blocco (
                Settore (
                  Cimitero (
                    Nome
                  )
                )
              )
            )
          `);

        if (error) {
          console.error("Error fetching cemeteries:", error);
          return;
        }

        // Extract and deduplicate cemetery names
        const cemeterySet = new Set<string>();
        
        data?.forEach(item => {
          const cemeteryName = item.loculi?.Blocco?.Settore?.Cimitero?.Nome;
          if (cemeteryName) {
            cemeterySet.add(cemeteryName);
          }
        });

        const uniqueCemeteries = Array.from(cemeterySet).sort();
        setCemeteries(uniqueCemeteries);
      } catch (error) {
        console.error("Error processing cemeteries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteries();
  }, []);

  if (loading) {
    return <DropdownMenuItem disabled>Caricamento cimiteri...</DropdownMenuItem>;
  }

  if (cemeteries.length === 0) {
    return <DropdownMenuItem disabled>Nessun cimitero disponibile</DropdownMenuItem>;
  }

  return (
    <>
      {cemeteries.map((cemetery) => (
        <DropdownMenuItem
          key={cemetery}
          className={selectedCemetery === cemetery ? 'bg-muted text-primary' : ''}
          onClick={() => onCemeterySelect(cemetery)}
        >
          {cemetery}
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default CemeteryOptions;
