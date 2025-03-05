
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CemeteryErrorDisplay from "@/components/cemetery/CemeteryErrorDisplay";
import CemeteryLoading from "@/components/cemetery/CemeteryLoading";
import { BlockTabs } from "@/components/block/BlockTabs";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb";

const BlockDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Extract search term from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const globalSearch = params.get('search');
    
    if (globalSearch) {
      setSearchTerm(globalSearch);
      setActiveTab("loculi");
    } else {
      setSearchTerm("");
      const savedTab = localStorage.getItem(`block-${id}-tab`);
      setActiveTab(savedTab);
    }
  }, [location.search, id]);

  useEffect(() => {
    const fetchBlockDetail = async () => {
      try {
        if (!id) {
          throw new Error("ID blocco non valido");
        }

        const numericId = parseInt(id, 10);
        
        if (isNaN(numericId)) {
          throw new Error("ID blocco non valido: deve essere un numero");
        }

        console.log("Fetching block with ID:", numericId);
        const { data, error } = await supabase
          .from('Blocco')
          .select(`
            *,
            Settore: IdSettore (*)
          `)
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        console.log("Block data fetched:", data);
        setBlock(data);
      } catch (err) {
        console.error("Errore nel caricamento dei dettagli del blocco:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockDetail();
  }, [id]);

  // Handle search within block
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(location.search);
    
    if (term) {
      params.set('search', term);
      setActiveTab("loculi");
    } else {
      params.delete('search');
    }
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  if (loading) {
    return <CemeteryLoading />;
  }

  if (error || !block) {
    return <CemeteryErrorDisplay error={error} />;
  }

  // Usa un'immagine di fallback se non c'è una immagine di copertina specifica per il blocco
  const coverPhotoUrl = block.FotoCopertina || "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&h=400&q=80";

  return (
    <div className="min-h-screen bg-background">
      <AppBreadcrumb />
      
      <div className="w-full h-48 md:h-64 relative overflow-hidden">
        <img 
          src={coverPhotoUrl} 
          alt={`${block.Nome || 'Blocco'} - immagine di copertina`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 flex flex-col justify-end">
          <div className="w-full px-4 py-4">
            <div className="w-full">
              <h2 className="text-white text-xl md:text-2xl font-semibold">
                {block.Nome || block.Codice || `Blocco ${block.Id}`}
              </h2>
              <p className="text-white/90 text-sm md:text-base">
                {block.Settore?.Nome ? `Settore: ${block.Settore.Nome}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
        
      <div className="w-full">
        <BlockTabs 
          block={block} 
          blockId={id || ''} 
          searchTerm={searchTerm}
          activeTab={activeTab}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default BlockDetail;
