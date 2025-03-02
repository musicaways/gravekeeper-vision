
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

  // Use cemetery photo as cover photo, fallback to placeholder if not available
  const coverPhotoUrl = cemetery.FotoCopertina || "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&h=400&q=80";

  return (
    <div className="min-h-screen bg-background">
      {/* Cover photo with semi-transparent overlay for text */}
      <div className="w-full h-48 md:h-64 relative overflow-hidden">
        <img 
          src={coverPhotoUrl} 
          alt={`${cemetery.nome || 'Cimitero'} - immagine di copertina`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
          <h2 className="text-white text-xl md:text-2xl font-semibold">{cemetery.nome || "Cimitero"}</h2>
          <p className="text-white/90 text-sm md:text-base">{cemetery.Indirizzo || "Indirizzo non disponibile"}</p>
        </div>
      </div>
        
      {/* Tab content with improved mobile layout */}
      <div className="px-4 py-4 w-full max-w-7xl mx-auto">
        <CemeteryTabs cemetery={cemetery} cemeteryId={id || ''} />
      </div>
    </div>
  );
};

export default CemeteryDetail;
