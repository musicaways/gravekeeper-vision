
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CemeterySectionsTabProps, Section, Block } from "./sections/types";
import { SectionsList } from "./sections/SectionsList";

export const CemeterySectionsTab: React.FC<CemeterySectionsTabProps> = ({ cemeteryId, searchTerm = "" }) => {
  const [sectionsWithBlocks, setSectionsWithBlocks] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      setLocalSearchTerm(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchSectionsAndBlocks = async () => {
      try {
        if (!cemeteryId) return;

        const numericCemeteryId = parseInt(cemeteryId, 10);
        
        if (isNaN(numericCemeteryId)) {
          throw new Error("ID cimitero non valido");
        }

        // Fetch sections for this cemetery
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('Settore')
          .select('*')
          .eq('IdCimitero', numericCemeteryId);

        if (sectionsError) throw sectionsError;

        // For each section, fetch its blocks
        if (sectionsData) {
          const sectionsWithBlocksData = await Promise.all(
            sectionsData.map(async (section) => {
              const { data: blocksData, error: blocksError } = await supabase
                .from('Blocco')
                .select('*')
                .eq('IdSettore', section.Id);

              if (blocksError) throw blocksError;

              return {
                ...section,
                blocchi: blocksData || []
              };
            })
          );

          setSectionsWithBlocks(sectionsWithBlocksData);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei settori e blocchi:", err);
        setError(err instanceof Error ? err.message : "Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };

    fetchSectionsAndBlocks();
  }, [cemeteryId]);

  // Filter sections and blocks based on search term
  const getFilteredSectionsAndBlocks = () => {
    if (!localSearchTerm) return sectionsWithBlocks;
    
    const searchTermLower = localSearchTerm.toLowerCase();
    
    return sectionsWithBlocks
      .map(section => {
        // Check if section name matches
        const sectionMatches = 
          section.Nome?.toLowerCase().includes(searchTermLower) || 
          section.Codice?.toLowerCase().includes(searchTermLower);
        
        // Filter blocks that match
        const matchingBlocks = section.blocchi?.filter(block => 
          block.Nome?.toLowerCase().includes(searchTermLower) ||
          block.Codice?.toLowerCase().includes(searchTermLower)
        ) || [];
        
        // If the section matches or has matching blocks, include it
        if (sectionMatches || matchingBlocks.length > 0) {
          // If section matches but no blocks match, return all blocks
          // If specific blocks match, return only those blocks
          return {
            ...section,
            blocchi: sectionMatches ? section.blocchi : matchingBlocks
          };
        }
        
        return null;
      })
      .filter(Boolean) as Section[];
  };

  const filteredSections = getFilteredSectionsAndBlocks();

  return (
    <div className="w-full">
      <SectionsList sections={filteredSections} loading={loading} error={error} />
    </div>
  );
};

export * from "./sections/types";
