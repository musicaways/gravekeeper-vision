
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CemeteryTabs } from "@/components/cemetery/CemeteryTabs";
import CemeteryErrorDisplay from "@/components/cemetery/CemeteryErrorDisplay";
import CemeteryLoading from "@/components/cemetery/CemeteryLoading";
import { Badge } from "@/components/ui/badge";

const CemeteryDetail = () => {
  const { id } = useParams();
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

  // Placeholder image for the cemetery cover photo
  const coverPhotoUrl = cemetery.cover_photo_url || "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&h=400&q=80";

  return (
    <div className="min-h-screen bg-background">
      {/* Cover photo */}
      <div className="w-full h-48 md:h-64 relative overflow-hidden">
        <img 
          src={coverPhotoUrl} 
          alt={`${cemetery.nome || 'Cimitero'} - immagine di copertina`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">{cemetery.nome || "Dettagli Cimitero"}</h2>
            {cemetery.active ? (
              <Badge className="bg-green-500 text-xs" variant="default">Attivo</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">Inattivo</Badge>
            )}
          </div>
          <p className="text-white/90 text-sm">{cemetery.Indirizzo || "Indirizzo non disponibile"}</p>
        </div>
      </div>
        
      {/* Tab content */}
      <div className="px-3 py-4">
        <CemeteryTabs cemetery={cemetery} cemeteryId={id || ''} />
      </div>
    </div>
  );
};

export default CemeteryDetail;
