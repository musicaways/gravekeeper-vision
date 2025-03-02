import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CemeteryTabs } from "@/components/cemetery/CemeteryTabs";
import CemeteryErrorDisplay from "@/components/cemetery/CemeteryErrorDisplay";
import CemeteryLoading from "@/components/cemetery/CemeteryLoading";
import { Calendar, Clipboard, Building, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

const CemeteryDetail = () => {
  const { id } = useParams();
  const [cemetery, setCemetery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCemeteryDetail = async () => {
      try {
        if (!id) {
          throw new Error("ID cimitero non valido");
        }

        const numericId = parseInt(id, 10);
        
        if (isNaN(numericId)) {
          throw new Error("ID cimitero non valido: deve essere un numero");
        }

        const { data, error } = await supabase
          .from('Cimitero')
          .select('*')
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        setCemetery(data);
      } catch (err) {
        console.error("Errore nel caricamento dei dettagli del cimitero:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryDetail();
  }, [id]);

  if (loading) {
    return <CemeteryLoading />;
  }

  if (error || !cemetery) {
    return <CemeteryErrorDisplay error={error} />;
  }

  const locationString = cemetery.city && cemetery.state ? `${cemetery.city}, ${cemetery.state}` : cemetery.Indirizzo;

  return (
    <div className="min-h-screen bg-background">
      {/* Contenuto principale */}
      <div className="px-3 py-4">
        {/* Card informazioni di base */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold">{cemetery.nome || "Dettagli Cimitero"}</h2>
              {cemetery.active ? (
                <Badge className="bg-green-500 text-xs" variant="default">Attivo</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Inattivo</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{cemetery.Descrizione || "Nessuna descrizione disponibile"}</p>
            <p className="text-sm"><span className="font-medium">Indirizzo:</span> {cemetery.Indirizzo || "Non disponibile"}</p>
          </CardContent>
        </Card>

        {/* Azioni ottimizzate per mobile */}
        <div className="flex justify-between mb-5">
          {/* Mostra solo 2 azioni principali su mobile e le altre in un menu dropdown */}
          <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Pianifica visita</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
              <Clipboard className="h-4 w-4" />
              <span className="text-xs">Nuova operazione</span>
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Aggiungi settore</span>
              </DropdownMenuItem>
              {/* Altre azioni qui */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Tab content */}
        <div className="mt-2">
          <CemeteryTabs cemetery={cemetery} cemeteryId={id || ''} />
        </div>
      </div>
    </div>
  );
};

export default CemeteryDetail;
