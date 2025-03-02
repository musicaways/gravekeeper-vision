
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapIcon, Plus, Search, FileDown, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export interface CemeterySectionsTabProps {
  cemeteryId: string;
}

interface Section {
  Id: number;
  Codice: string;
  Descrizione: string;
  area_sqm: number;
  section_type: string;
  max_capacity: number;
  current_occupancy: number;
  blocchi?: Block[];
}

interface Block {
  Id: number;
  Codice: string;
  Descrizione: string;
  NumeroLoculi: number;
  available_plots: number;
  total_plots: number;
}

export const CemeterySectionsTab: React.FC<CemeterySectionsTabProps> = ({ cemeteryId }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        if (!cemeteryId) return;

        // Convert the string ID to a number
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
          // Ottieni i blocchi per ogni settore
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

  const filteredSections = sections.filter(section => 
    section.Codice?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    section.Descrizione?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca settori..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Esporta</span>
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nuovo Settore</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md p-4">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nessun settore disponibile per questo cimitero</p>
            <Button variant="outline" className="mt-4">
              Aggiungi un nuovo settore
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSections.map((section) => (
              <div key={section.Id} className="border rounded-md overflow-hidden">
                <div className="bg-muted/50 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {section.Codice || `Settore ${section.Id}`}
                        {section.section_type && (
                          <Badge variant="outline" className="ml-2">
                            {section.section_type}
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {section.Descrizione || "Nessuna descrizione"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Dettagli
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="bg-background p-3 rounded-md border">
                      <div className="text-sm text-muted-foreground">Area Totale</div>
                      <div className="text-lg font-medium mt-1">
                        {section.area_sqm ? `${section.area_sqm} m²` : "N/D"}
                      </div>
                    </div>
                    <div className="bg-background p-3 rounded-md border">
                      <div className="text-sm text-muted-foreground">Capacità Massima</div>
                      <div className="text-lg font-medium mt-1">
                        {section.max_capacity || "N/D"}
                      </div>
                    </div>
                    <div className="bg-background p-3 rounded-md border">
                      <div className="text-sm text-muted-foreground">Occupazione Attuale</div>
                      <div className="text-lg font-medium mt-1">
                        {section.current_occupancy !== null && section.max_capacity 
                          ? `${section.current_occupancy}/${section.max_capacity} (${Math.round((section.current_occupancy / section.max_capacity) * 100)}%)`
                          : "N/D"
                        }
                      </div>
                    </div>
                  </div>

                  {/* Blocchi */}
                  {section.blocchi && section.blocchi.length > 0 ? (
                    <div>
                      <h4 className="font-medium mb-2">Blocchi ({section.blocchi.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {section.blocchi.map(block => (
                          <div key={block.Id} className="border rounded p-3 bg-background">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">{block.Codice || `Blocco ${block.Id}`}</div>
                              <Badge variant="outline" className="text-xs">
                                {block.NumeroLoculi || 0} loculi
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {block.Descrizione || "Nessuna descrizione"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-2">
                      Nessun blocco disponibile per questo settore
                    </div>
                  )}
                </div>

                <CardFooter className="bg-muted/20 justify-end p-2">
                  <Button variant="ghost" size="sm">
                    Gestisci Blocchi
                  </Button>
                </CardFooter>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
