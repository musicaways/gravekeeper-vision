
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
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
  const [filteredDeceased, setFilteredDeceased] = useState<DeceasedRecord[]>([]);
  const { toast } = useToast();

  // Fetch all deceased data
  useEffect(() => {
    fetchDeceased();
  }, []);

  // Apply filtering and sorting
  useEffect(() => {
    // Apply search filtering
    let resultSet = deceased;
    
    if (searchTerm) {
      resultSet = resultSet.filter(d => 
        d.nominativo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply additional filtering based on filterBy
    switch (filterBy) {
      case 'recent':
        // Filter for records with death date in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        resultSet = resultSet.filter(d => {
          if (!d.data_decesso) return false;
          const deathDate = new Date(d.data_decesso);
          return deathDate >= thirtyDaysAgo;
        });
        break;
      case 'this-year':
        // Filter for records with death date in the current year
        const currentYear = new Date().getFullYear();
        resultSet = resultSet.filter(d => {
          if (!d.data_decesso) return false;
          const deathDate = new Date(d.data_decesso);
          return deathDate.getFullYear() === currentYear;
        });
        break;
      case 'by-cemetery':
        // Filter for records by specific cemetery
        if (selectedCemetery) {
          resultSet = resultSet.filter(d => 
            d.cimitero_nome === selectedCemetery
          );
        }
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }
    
    // Apply sorting
    const sortedData = [...resultSet];
    
    switch (sortBy) {
      case 'name-asc':
        sortedData.sort((a, b) => (a.nominativo || '').localeCompare(b.nominativo || ''));
        break;
      case 'name-desc':
        sortedData.sort((a, b) => (b.nominativo || '').localeCompare(a.nominativo || ''));
        break;
      case 'date-desc':
        sortedData.sort((a, b) => {
          // If dates are missing, place those entries at the end
          if (!a.data_decesso) return 1;
          if (!b.data_decesso) return -1;
          return new Date(b.data_decesso).getTime() - new Date(a.data_decesso).getTime();
        });
        break;
      case 'date-asc':
        sortedData.sort((a, b) => {
          // If dates are missing, place those entries at the end
          if (!a.data_decesso) return 1;
          if (!b.data_decesso) return -1;
          return new Date(a.data_decesso).getTime() - new Date(b.data_decesso).getTime();
        });
        break;
      case 'cemetery-asc':
        sortedData.sort((a, b) => {
          const cimA = a.cimitero_nome || '';
          const cimB = b.cimitero_nome || '';
          return cimA.localeCompare(cimB);
        });
        break;
      case 'cemetery-desc':
        sortedData.sort((a, b) => {
          const cimA = a.cimitero_nome || '';
          const cimB = b.cimitero_nome || '';
          return cimB.localeCompare(cimA);
        });
        break;
      default:
        // Default to name ascending
        sortedData.sort((a, b) => (a.nominativo || '').localeCompare(b.nominativo || ''));
    }
    
    setFilteredDeceased(sortedData);
  }, [sortBy, filterBy, deceased, searchTerm, selectedCemetery]);

  const fetchDeceased = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Defunto')
        .select(`
          Id,
          Nominativo,
          DataDecesso,
          DataNascita,
          Eta,
          IdLoculo
        `)
        .order('Nominativo', { ascending: true })
        .limit(50); // Limita i risultati per performance

      if (error) {
        throw error;
      }

      // Crea un array di record semplificati
      const transformedData: DeceasedRecord[] = data.map(item => ({
        id: item.Id,
        nominativo: item.Nominativo || '',
        data_decesso: item.DataDecesso,
        data_nascita: item.DataNascita,
        eta: item.Eta,
        cimitero_nome: 'Non disponibile',
        settore_nome: 'Non disponibile',
        blocco_nome: 'Non disponibile',
        loculo_numero: null,
        loculo_fila: null,
        loculi: null
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

  return {
    loading,
    filteredDeceased,
    fetchDeceased
  };
};
