
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
        // Query the defunti table first
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
            id_loculo
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

        const { data: defuntiData, error: defuntiError } = await query;

        if (defuntiError) {
          console.error("Error fetching deceased data:", defuntiError);
          setDeceased([]);
          setLoading(false);
          return;
        }

        // Now we need to fetch the Loculo information for each record
        // and apply cemetery filter if needed
        const defuntiWithLoculiPromises = defuntiData.map(async (defunto) => {
          let loculoData = null;

          if (defunto.id_loculo) {
            try {
              const loculoId = parseInt(defunto.id_loculo);
              
              if (!isNaN(loculoId)) {
                const { data: loculo, error: loculoError } = await supabase
                  .from('Loculo')
                  .select(`
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
                  `)
                  .eq('id', loculoId)
                  .maybeSingle();

                if (!loculoError && loculo) {
                  loculoData = loculo;
                }
              }
            } catch (error) {
              console.error("Error fetching loculo:", error);
            }
          }
          
          // Filter by cemetery if needed
          if (selectedCemetery && filterBy === 'by-cemetery') {
            if (!loculoData || 
                !loculoData.Blocco || 
                !loculoData.Blocco.Settore || 
                !loculoData.Blocco.Settore.Cimitero || 
                loculoData.Blocco.Settore.Cimitero.Nome !== selectedCemetery) {
              return null; // Skip this record if it doesn't match the cemetery filter
            }
          }

          return {
            id: defunto.id,
            nominativo: defunto.nominativo,
            data_nascita: defunto.data_nascita,
            data_decesso: defunto.data_decesso,
            eta: defunto.eta,
            sesso: defunto.sesso,
            annotazioni: defunto.annotazioni,
            stato_defunto: defunto.stato_defunto,
            id_loculo: defunto.id_loculo,
            loculo_numero: loculoData?.Numero || null,
            loculo_fila: loculoData?.Fila || null,
            cimitero_nome: loculoData?.Blocco?.Settore?.Cimitero?.Nome || null,
            settore_nome: loculoData?.Blocco?.Settore?.Nome || null,
            blocco_nome: loculoData?.Blocco?.Nome || null,
            loculi: loculoData
          } as DeceasedRecord;
        });

        const defuntiWithLoculi = await Promise.all(defuntiWithLoculiPromises);
        
        // Filter out null records (those that didn't match the cemetery filter)
        const filteredDeceased = defuntiWithLoculi.filter(record => record !== null) as DeceasedRecord[];
        
        setDeceased(filteredDeceased);
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
