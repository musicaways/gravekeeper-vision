
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { NicheMap } from "@/components/niche-map/NicheMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, ZoomIn, ZoomOut, Map as MapIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { NicheInfo } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const CemeteryNicheMap = ({ blockId }: { blockId?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [niches, setNiches] = useState<NicheInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(blockId || null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [rows, setRows] = useState(8);
  const [columns, setColumns] = useState(12);
  const { toast } = useToast();

  // Fetch blocks data
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const { data, error } = await supabase
          .from('Blocco')
          .select('*');
          
        if (error) throw error;
        
        setBlocks(data || []);
        
        if (!selectedBlock && data && data.length > 0) {
          setSelectedBlock(data[0].Id.toString());
        }
      } catch (error) {
        console.error('Error fetching blocks:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load block data"
        });
      }
    };
    
    fetchBlocks();
  }, [toast, selectedBlock]);

  // Fetch niches data
  useEffect(() => {
    if (!selectedBlock) return;
    
    const fetchNiches = async () => {
      setIsLoading(true);
      try {
        // Get the number of rows and columns for the selected block
        const { data: blockData, error: blockError } = await supabase
          .from('Blocco')
          .select('NumeroFile, NumeroLoculi')
          .eq('Id', parseInt(selectedBlock, 10))
          .single();
          
        if (blockError) throw blockError;
        
        if (blockData) {
          setRows(blockData.NumeroFile || 8);
          setColumns(blockData.NumeroLoculi || 12);
        }
        
        // Get the loculo data
        const { data: loculiData, error: loculiError } = await supabase
          .from('Loculo')
          .select(`
            Id,
            Numero,
            Fila,
            TipoTomba,
            Annotazioni,
            Defunto (
              Id,
              Nominativo,
              DataDecesso
            )
          `)
          .eq('IdBlocco', parseInt(selectedBlock, 10));
          
        if (loculiError) throw loculiError;
        
        // Transform data to match NicheInfo type
        const nicheData: NicheInfo[] = (loculiData || []).map((loculo) => {
          return {
            id: loculo.Id.toString(),
            row: loculo.Fila || 0,
            column: loculo.Numero || 0,
            status: loculo.Defunto ? "occupied" : "available",
            deceasedName: loculo.Defunto?.Nominativo, // Usa l'operatore di optional chaining
            expirationDate: undefined
          };
        });
        
        setNiches(nicheData);
      } catch (error) {
        console.error('Error fetching niches:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load niche data"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNiches();
  }, [selectedBlock, toast]);

  // Filter niches based on search query
  const filteredNiches = searchQuery 
    ? niches.filter(niche => 
        niche.deceasedName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : niches;

  const handleNicheClick = (nicheId: string) => {
    const niche = niches.find(n => n.id === nicheId);
    if (niche) {
      toast({
        title: `Niche ${niche.row}-${niche.column}`,
        description: niche.deceasedName 
          ? `Occupied by: ${niche.deceasedName}` 
          : "This niche is available",
      });
    }
  };

  const handleRefresh = () => {
    if (selectedBlock) {
      // Re-fetch niches data
      setNiches([]);
      setIsLoading(true);
      // The useEffect will handle the actual data fetching
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          Mappa delle Nicchie
        </CardTitle>
        <CardDescription>
          Visualizza e gestisci le nicchie del blocco selezionato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select 
                value={selectedBlock || ''} 
                onValueChange={setSelectedBlock}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un blocco" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map(block => (
                    <SelectItem key={block.Id} value={block.Id.toString()}>
                      {block.Descrizione || `Blocco ${block.Id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per nome..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-lg">
              {niches.length > 0 ? (
                <div className="py-4">
                  <NicheMap
                    blockId={selectedBlock || ""}
                    rows={rows}
                    columns={columns}
                    niches={filteredNiches}
                    onNicheClick={handleNicheClick}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Nessun dato disponibile per questo blocco
                  </p>
                  <Button variant="outline" onClick={handleRefresh}>
                    Ricarica
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                <span className="text-xs">Disponibile</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                <span className="text-xs">Occupato</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                <span className="text-xs">Riservato</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
                <span className="text-xs">Manutenzione</span>
              </div>
            </div>
            
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={() => {}}>
                <ZoomIn className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Zoom In</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => {}}>
                <ZoomOut className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Zoom Out</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
