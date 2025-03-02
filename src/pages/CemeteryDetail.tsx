
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
      {/* Cover photo container - full width with controlled height */}
      <div className="w-full h-40 md:h-56 relative overflow-hidden">
        {/* Image container with absolute positioning to fill the entire space */}
        <img 
          src={coverPhotoUrl} 
          alt={`${cemetery.nome || 'Cimitero'} - immagine di copertina`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
          <div className="container mx-auto px-4">
            <h2 className="text-white text-xl md:text-2xl font-semibold">{cemetery.Nome || cemetery.nome || "Cimitero"}</h2>
            <p className="text-white/90 text-sm md:text-base">{cemetery.Indirizzo || "Indirizzo non disponibile"}</p>
          </div>
        </div>
      </div>
        
      {/* Tab content container with same width constraints as the cover image */}
      <div className="container mx-auto px-4 py-4">
        <CemeteryTabs cemetery={cemetery} cemeteryId={id || ''} />
      </div>
    </div>
  );
};

export default CemeteryDetail;
