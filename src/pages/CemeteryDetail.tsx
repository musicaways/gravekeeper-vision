
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CemeteryHeader from "@/components/cemetery/CemeteryHeader";
import { CemeteryTabs } from "@/components/cemetery/CemeteryTabs";
import CemeteryErrorDisplay from "@/components/cemetery/CemeteryErrorDisplay";
import CemeteryLoading from "@/components/cemetery/CemeteryLoading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Calendar, Clipboard, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const CemeteryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cemetery, setCemetery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="bg-card py-4 border-b px-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate('/cemeteries')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Indietro
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold">{cemetery.nome || "Dettagli Cimitero"}</h1>
              <p className="text-muted-foreground">{locationString}</p>
            </div>
            
            <div className="ml-auto flex gap-2">
              {cemetery.active ? (
                <Badge className="bg-green-500" variant="default">Attivo</Badge>
              ) : (
                <Badge variant="secondary">Inattivo</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Pianifica visita
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Clipboard className="h-4 w-4" />
            Aggiungi operazione
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Aggiungi settore
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <CemeteryTabs cemetery={cemetery} cemeteryId={id || ''} />
        </div>
      </div>

      <footer className="bg-muted py-6 mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sistema Gestione Cimiteriale - Tutti i diritti riservati
        </div>
      </footer>
    </div>
  );
};

export default CemeteryDetail;
