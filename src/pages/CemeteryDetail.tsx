
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CemeteryTabs } from "@/components/cemetery/CemeteryTabs";
import CemeteryErrorDisplay from "@/components/cemetery/CemeteryErrorDisplay";
import CemeteryLoading from "@/components/cemetery/CemeteryLoading";

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

  const coverPhotoUrl = cemetery.FotoCopertina || "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&h=400&q=80";

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-48 md:h-64 relative overflow-hidden">
        <img 
          src={coverPhotoUrl} 
          alt={`${cemetery.nome || 'Cimitero'} - immagine di copertina`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/30 p-4">
          <div className="container mx-auto">
            <h2 className="text-white text-xl md:text-2xl font-semibold">{cemetery.Nome || cemetery.nome || "Cimitero"}</h2>
            <p className="text-white/90 text-sm md:text-base">{cemetery.Indirizzo || "Indirizzo non disponibile"}</p>
          </div>
        </div>
      </div>
        
      <div className="container mx-auto">
        <CemeteryTabs cemetery={cemetery} cemeteryId={id || ''} />
      </div>
    </div>
  );
};

export default CemeteryDetail;
