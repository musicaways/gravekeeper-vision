
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CemeteryTabs } from "@/components/cemetery/CemeteryTabs";
import CemeteryErrorDisplay from "@/components/cemetery/CemeteryErrorDisplay";
import CemeteryLoading from "@/components/cemetery/CemeteryLoading";

const CemeteryDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [cemetery, setCemetery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const globalSearch = params.get('search');
    
    if (globalSearch) {
      setSearchTerm(globalSearch);
      setActiveTab("sections");
    } else {
      setSearchTerm("");
      const savedTab = localStorage.getItem(`cemetery-${id}-tab`);
      setActiveTab(savedTab);
    }
  }, [location.search, id]);

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

        console.log("Fetching cemetery with ID:", numericId);
        const { data, error } = await supabase
          .from('Cimitero')
          .select('*')
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        console.log("Cemetery data fetched:", data);
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

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(location.search);
    
    if (term) {
      params.set('search', term);
      setActiveTab("sections");
    } else {
      params.delete('search');
    }
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  if (loading) {
    return <CemeteryLoading />;
  }

  if (error || !cemetery) {
    return <CemeteryErrorDisplay error={error} />;
  }

  const coverPhotoUrl = cemetery.FotoCopertina || "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&h=400&q=80";

  return (
    <div className="min-h-screen bg-background">
      {/* Container for the cover photo with consistent width */}
      <div className="w-full h-48 md:h-64 relative overflow-hidden">
        <img 
          src={coverPhotoUrl} 
          alt={`${cemetery.nome || 'Cimitero'} - immagine di copertina`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/30 p-4">
          <div className="w-full max-w-none px-1">
            <h2 className="text-white text-xl md:text-2xl font-semibold">{cemetery.Nome || cemetery.nome || "Cimitero"}</h2>
            <p className="text-white/90 text-sm md:text-base">{cemetery.Indirizzo || "Indirizzo non disponibile"}</p>
          </div>
        </div>
      </div>
        
      <div className="w-full max-w-none px-1">
        <CemeteryTabs 
          cemetery={cemetery} 
          cemeteryId={id || ''} 
          searchTerm={searchTerm}
          activeTab={activeTab}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default CemeteryDetail;
