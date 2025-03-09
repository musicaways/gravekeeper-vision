
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
  loculi: {
    id: string;
    numero: number | null;
    fila: number | null;
    Blocco: {
      Id: number;
      Nome: string | null;
      Settore: {
        Id: number;
        Nome: string | null;
        Cimitero: {
          Id: number;
          Nome: string | null;
        } | null;
      } | null;
    } | null;
  } | null;
}

interface DeceasedListProps {
  searchTerm: string;
  sortBy: string;
  filterBy: string;
}

const DeceasedList: React.FC<DeceasedListProps> = ({ searchTerm, sortBy, filterBy }) => {
  const [loading, setLoading] = useState(true);
  const [deceased, setDeceased] = useState<DeceasedRecord[]>([]);
  const [filteredDeceased, setFilteredDeceased] = useState<DeceasedRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeceased();
  }, []);

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
      case 'has-cemetery':
        // Filter for records with cemetery information
        resultSet = resultSet.filter(d => Boolean(d.cimitero_nome));
        break;
      case 'without-cemetery':
        // Filter for records without cemetery information
        resultSet = resultSet.filter(d => !d.cimitero_nome);
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
  }, [sortBy, filterBy, deceased, searchTerm]);

  const fetchDeceased = async () => {
    setLoading(true);
    try {
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

      const transformedData: DeceasedRecord[] = data
        .filter(item => item.loculi)
        .map(item => ({
          id: item.id,
          nominativo: item.nominativo,
          data_decesso: item.data_decesso,
          cimitero_nome: item.loculi?.Blocco?.Settore?.Cimitero?.Nome || null,
          settore_nome: item.loculi?.Blocco?.Settore?.Nome || null,
          blocco_nome: item.loculi?.Blocco?.Nome || null,
          loculo_numero: item.loculi?.numero || null,
          loculo_fila: item.loculi?.fila || null,
          loculi: item.loculi
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
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-md">
              <Skeleton className="h-16 w-full rounded-t-md" />
              <div className="p-3">
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="p-3 border-t">
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="p-3 border-t">
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredDeceased.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-1">
          {filteredDeceased.map((deceased) => (
            <DeceasedListItem key={deceased.id} deceased={deceased} />
          ))}
        </div>
      ) : (
        <DeceasedEmptyState searchTerm={searchTerm} onClear={() => {}} />
      )}
    </div>
  );
};

export default DeceasedList;
