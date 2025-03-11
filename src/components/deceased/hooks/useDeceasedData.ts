
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
        // Utilizziamo la nuova tabella defunti invece di Defunto
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

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching deceased data:", error);
          setDeceased([]);
        } else {
          // Trasformare i dati nel formato richiesto da DeceasedRecord
          const transformedData: DeceasedRecord[] = data.map(item => ({
            id: item.id,
            nominativo: item.nominativo || 'No name',
            data_decesso: item.data_decesso,
            data_nascita: item.data_nascita,
            eta: item.eta,
            annotazioni: item.annotazioni,
            sesso: item.sesso,
            stato_defunto: item.stato_defunto,
            cimitero_nome: null, // Da riempire con join future
            settore_nome: null,
            blocco_nome: null,
            loculo_numero: null,
            loculo_fila: null,
            loculi: null
          }));
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

  // Filtro per cimitero viene gestito direttamente nel database per ora
  const filteredDeceased = deceased;

  return {
    loading,
    filteredDeceased
  };
};
