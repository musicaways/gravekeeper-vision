
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Phone, Map, Pencil, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface BlockInfoTabContentProps {
  block: any;
}

const BlockInfoTabContent: React.FC<BlockInfoTabContentProps> = ({ block }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const canEdit = !!user;
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlockMap = async () => {
      try {
        if (!block || !block.Id) return;

        const { data, error } = await supabase
          .from('BloccoMappe')
          .select('Url')
          .eq('IdBlocco', block.Id)
          .order('DataInserimento', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMapUrl(data[0].Url);
        }
      } catch (err) {
        console.error("Errore nel caricamento della mappa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockMap();
  }, [block]);

  const handleEdit = () => {
    setIsEditing(true);
    toast({
      title: "Modalità modifica",
      description: "Ora puoi modificare le informazioni del blocco.",
    });
  };

  const formatMultilineText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <p key={i} className="text-sm md:text-base mb-1">
        {line || <br />}
      </p>
    ));
  };

  return (
    <Card className="w-full shadow-sm relative mx-auto">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-6">
          {block.Descrizione && (
            <div className="w-full">
              <h3 className="text-sm font-medium mb-2">Descrizione</h3>
              <div className="p-4 rounded-md w-full">
                {formatMultilineText(block.Descrizione)}
              </div>
            </div>
          )}
          
          {block.Annotazioni && (
            <div className="w-full">
              <h3 className="text-sm font-medium mb-2">Annotazioni</h3>
              <div className="p-4 rounded-md w-full">
                {formatMultilineText(block.Annotazioni)}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Nome</h4>
                  <p className="text-sm md:text-base">{block.Nome || "Non disponibile"}</p>
                </div>
              </div>

              {block.Codice && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Codice</h4>
                    <p className="text-sm md:text-base">{block.Codice}</p>
                  </div>
                </div>
              )}

              {block.NumeroLoculi !== undefined && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Numero Loculi</h4>
                    <p className="text-sm md:text-base">{block.NumeroLoculi}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {block.NumeroFile !== undefined && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Numero File</h4>
                    <p className="text-sm md:text-base">{block.NumeroFile}</p>
                  </div>
                </div>
              )}

              {block.Settore && (
                <div className="flex items-start gap-3">
                  <Map className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Settore</h4>
                    <p className="text-sm md:text-base">{block.Settore.Nome || block.Settore.Codice || `Settore ${block.Settore.Id}`}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Map section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Map className="h-5 w-5" />
              Mappa del blocco
            </h3>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="ml-2">Caricamento mappa...</span>
              </div>
            ) : mapUrl ? (
              <div className="rounded-md overflow-hidden border border-border h-[400px] mt-4">
                <img 
                  src={mapUrl} 
                  alt="Mappa del blocco" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="text-center py-6 bg-muted/30 rounded-md">
                <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground mb-2">Mappa non disponibile per questo blocco</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {canEdit && (
        <Button 
          onClick={handleEdit}
          size="icon"
          variant="secondary"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-md z-10 bg-primary-light hover:bg-primary-dark text-white transition-all duration-300"
        >
          <Edit className="h-5 w-5" />
        </Button>
      )}
    </Card>
  );
};

export default BlockInfoTabContent;
