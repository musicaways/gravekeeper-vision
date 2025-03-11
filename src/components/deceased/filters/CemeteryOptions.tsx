
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
    // Carica direttamente l'elenco dei cimiteri
    const fetchCemeteries = async () => {
      try {
        const { data, error } = await supabase
          .from('Cimitero')
          .select('Nome')
          .order('Nome', { ascending: true });

        if (error) {
          console.error("Errore nel caricamento dei cimiteri:", error);
          return;
        }

        // Estrai i nomi dei cimiteri
        const cemeteryNames = data?.map(item => item.Nome).filter(Boolean);
        setCemeteries(cemeteryNames || []);
      } catch (error) {
        console.error("Errore nell'elaborazione dei cimiteri:", error);
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
