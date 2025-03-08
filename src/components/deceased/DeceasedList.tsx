
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import DeceasedListItem from "./DeceasedListItem";
import DeceasedEmptyState from "./DeceasedEmptyState";

interface DeceasedRecord {
  id: string;
  nominativo: string;
  data_decesso: string | null;
  cimitero_nome: string | null;
  settore_nome: string | null;
  blocco_nome: string | null;
  loculo_numero: number | null;
  loculo_fila: number | null;
}

interface DeceasedListProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DeceasedList: React.FC<DeceasedListProps> = ({ searchTerm, setSearchTerm }) => {
  const [loading, setLoading] = useState(true);
  const [deceased, setDeceased] = useState<DeceasedRecord[]>([]);
  const [filteredDeceased, setFilteredDeceased] = useState<DeceasedRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeceased();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = deceased.filter(d => 
        d.nominativo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDeceased(filtered);
    } else {
      setFilteredDeceased(deceased);
    }
  }, [searchTerm, deceased]);

  const fetchDeceased = async () => {
    setLoading(true);
    try {
      // Fix the query structure to correct join the tables
      const { data, error } = await supabase
        .from('defunti')
        .select(`
          id,
          nominativo,
          data_decesso,
          loculi (
            id,
            numero,
            fila,
            Blocco (
              Id,
              Nome,
              Settore (
                Id,
                Nome,
                Cimitero (
                  Id,
                  Nome
                )
              )
            )
          )
        `)
        .order('nominativo', { ascending: true });

      if (error) {
        throw error;
      }

      // Transform data to flatten the structure
      const transformedData: DeceasedRecord[] = data
        .filter(item => item.loculi) // Filter out records without loculi
        .map(item => ({
          id: item.id,
          nominativo: item.nominativo,
          data_decesso: item.data_decesso,
          cimitero_nome: item.loculi?.Blocco?.Settore?.Cimitero?.Nome || null,
          settore_nome: item.loculi?.Blocco?.Settore?.Nome || null,
          blocco_nome: item.loculi?.Blocco?.Nome || null,
          loculo_numero: item.loculi?.numero || null,
          loculo_fila: item.loculi?.fila || null
        }));

      setDeceased(transformedData);
      setFilteredDeceased(transformedData);
      
    } catch (error) {
      console.error('Error fetching deceased:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare i dati dei defunti"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-2 space-y-4 w-full">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-md overflow-hidden">
              <div className="p-4">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredDeceased.length > 0 ? (
        <div className="space-y-4">
          {filteredDeceased.map((deceased) => (
            <DeceasedListItem key={deceased.id} deceased={deceased} />
          ))}
        </div>
      ) : (
        <DeceasedEmptyState searchTerm={searchTerm} onClear={() => setSearchTerm("")} />
      )}
    </div>
  );
};

export default DeceasedList;
