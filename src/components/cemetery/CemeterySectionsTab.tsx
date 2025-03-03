
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CemeterySectionsTabProps, Section } from "./sections/types";
import { SectionSearchBar } from "./sections/SectionSearchBar";
import { SectionsList } from "./sections/SectionsList";

export const CemeterySectionsTab: React.FC<CemeterySectionsTabProps> = ({ cemeteryId, searchTerm = "" }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      setLocalSearchTerm(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        if (!cemeteryId) return;

        const numericCemeteryId = parseInt(cemeteryId, 10);
        
        if (isNaN(numericCemeteryId)) {
          throw new Error("ID cimitero non valido");
        }

        const { data, error } = await supabase
          .from('Settore')
          .select('*')
          .eq('IdCimitero', numericCemeteryId);

        if (error) throw error;

        if (data) {
          const sectionsWithBlocks = await Promise.all(
            data.map(async (section) => {
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

          setSections(sectionsWithBlocks);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei settori:", err);
        setError(err instanceof Error ? err.message : "Errore nel caricamento dei settori");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [cemeteryId]);

  const getFilteredSections = () => {
    const searchTermToUse = localSearchTerm.toLowerCase();
    
    return sections.filter(section => 
      section.Codice?.toLowerCase().includes(searchTermToUse) || 
      section.Descrizione?.toLowerCase().includes(searchTermToUse)
    );
  };

  const filteredSections = getFilteredSections();

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Settori del cimitero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 text-destructive rounded-md p-4">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          Settori del cimitero
        </CardTitle>
        <CardDescription>
          Visualizza e gestisci le diverse aree e settori del cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SectionSearchBar 
          searchTerm={localSearchTerm} 
          onSearchChange={setLocalSearchTerm} 
        />
        <SectionsList sections={filteredSections} loading={loading} />
      </CardContent>
    </Card>
  );
};

export * from "./sections/types";
