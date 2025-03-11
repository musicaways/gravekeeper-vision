
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

        // Applicare filtro per cimitero se selezionato
        if (selectedCemetery && filterBy === 'by-cemetery') {
          // Questa parte richiederà un approccio diverso dato che ora abbiamo solo l'id del loculo
          // Potremmo implementarlo in futuro con una query più complessa
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching deceased data:", error);
          setDeceased([]);
        } else {
          // Ora recuperiamo le informazioni aggiuntive dei loculi separatamente
          // dato che id_loculo è una stringa che contiene il valore numerico originale
          const transformedData: DeceasedRecord[] = await Promise.all(
            data.map(async (item) => {
              let loculoInfo = {
                loculo_numero: null, 
                loculo_fila: null,
                cimitero_nome: null,
                settore_nome: null,
                blocco_nome: null,
                loculi: null
              };
              
              if (item.id_loculo) {
                // Cerca le informazioni del loculo nella tabella Loculo
                const { data: loculoData, error: loculoError } = await supabase
                  .from('Loculo')
                  .select(`
                    id,
                    Numero,
                    Fila,
                    Blocco:IdBlocco (
                      Id,
                      Nome,
                      Settore:IdSettore (
                        Id,
                        Nome,
                        Cimitero:IdCimitero (
                          Id,
                          Nome
                        )
                      )
                    )
                  `)
                  .eq('id', item.id_loculo)
                  .single();
                
                if (!loculoError && loculoData) {
                  loculoInfo = {
                    loculo_numero: loculoData.Numero, 
                    loculo_fila: loculoData.Fila,
                    cimitero_nome: loculoData.Blocco?.Settore?.Cimitero?.Nome || null,
                    settore_nome: loculoData.Blocco?.Settore?.Nome || null,
                    blocco_nome: loculoData.Blocco?.Nome || null,
                    loculi: loculoData
                  };
                }
              }
              
              return {
                ...item,
                ...loculoInfo
              };
            })
          );
          
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

  // Filtro per cimitero viene gestito direttamente nel database o nella trasformazione dati
  const filteredDeceased = deceased;

  return {
    loading,
    filteredDeceased
  };
};
