
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DeceasedRecord } from "../types/deceased";

interface UseDeceasedDataProps {
  searchTerm: string;
  sortBy: string;
  filterBy: string;
  selectedCemetery: string | null;
}

export const useDeceasedData = ({ 
  searchTerm, 
  sortBy, 
  filterBy,
  selectedCemetery
}: UseDeceasedDataProps) => {
  const [loading, setLoading] = useState(true);
  const [deceased, setDeceased] = useState<DeceasedRecord[]>([]);

  useEffect(() => {
    const fetchDeceased = async () => {
      setLoading(true);
      try {
        // Utilizziamo la tabella defunti con join alle tabelle correlate
        let query = supabase
          .from('defunti')
          .select(`
            id,
            nominativo,
            data_nascita,
            data_decesso,
            eta,
            sesso,
            annotazioni,
            stato_defunto,
            id_loculo,
            Loculo!left(
              id,
              Numero,
              Fila,
              Blocco:IdBlocco(
                Id,
                Nome,
                Settore:IdSettore(
                  Id,
                  Nome,
                  Cimitero:IdCimitero(
                    Id,
                    Nome
                  )
                )
              )
            )
          `)
          .order(sortBy === 'name' ? 'nominativo' : 'data_decesso', { ascending: sortBy !== 'recent' });

        // Applicare filtri
        if (filterBy === 'recent') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query = query.gte('data_decesso', thirtyDaysAgo.toISOString().split('T')[0]);
        } else if (filterBy === 'this-year') {
          const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
          query = query.gte('data_decesso', startOfYear);
        }

        // Applicare ricerca per nome
        if (searchTerm.trim() !== '') {
          query = query.ilike('nominativo', `%${searchTerm}%`);
        }

        // Applicare filtro per cimitero se selezionato
        if (selectedCemetery && filterBy === 'by-cemetery') {
          query = query.eq('Loculo.Blocco.Settore.Cimitero.Nome', selectedCemetery);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching deceased data:", error);
          setDeceased([]);
        } else {
          // Transform data to match the DeceasedRecord structure
          const transformedData: DeceasedRecord[] = data.map(item => {
            const loculoData = item.Loculo;
            
            return {
              id: item.id,
              nominativo: item.nominativo,
              data_nascita: item.data_nascita,
              data_decesso: item.data_decesso,
              eta: item.eta,
              sesso: item.sesso,
              annotazioni: item.annotazioni,
              stato_defunto: item.stato_defunto,
              id_loculo: item.id_loculo,
              loculo_numero: loculoData?.Numero || null,
              loculo_fila: loculoData?.Fila || null,
              cimitero_nome: loculoData?.Blocco?.Settore?.Cimitero?.Nome || null,
              settore_nome: loculoData?.Blocco?.Settore?.Nome || null,
              blocco_nome: loculoData?.Blocco?.Nome || null,
              loculi: loculoData || null
            };
          });
          
          setDeceased(transformedData);
        }
      } catch (error) {
        console.error("Failed to fetch deceased:", error);
        setDeceased([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeceased();
  }, [searchTerm, sortBy, filterBy, selectedCemetery]);

  return {
    loading,
    filteredDeceased: deceased
  };
};
