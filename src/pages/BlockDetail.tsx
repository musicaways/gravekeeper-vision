import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CemeteryErrorDisplay from "@/components/cemetery/CemeteryErrorDisplay";
import CemeteryLoading from "@/components/cemetery/CemeteryLoading";
import { BlockTabs } from "@/components/block/BlockTabs";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb";
import { decodeText } from "@/utils/textFormatters";

const BlockDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

  const coverPhotoUrl = block.FotoCopertina || "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&h=400&q=80";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppBreadcrumb />
      
      <div className="w-full h-48 md:h-64 relative overflow-hidden">
        <img 
          src={coverPhotoUrl} 
          alt={`${decodeText(block.Nome) || 'Blocco'} - immagine di copertina`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/30 p-4">
          <div className="w-full max-w-none px-1">
            <h2 className="text-white text-xl md:text-2xl font-semibold">
              {decodeText(block.Nome) || decodeText(block.Codice) || `Blocco ${block.Id}`}
            </h2>
            <p className="text-white/90 text-sm md:text-base">
              {block.Settore?.Nome ? `Settore: ${decodeText(block.Settore.Nome)}` : ""}
            </p>
          </div>
        </div>
      </div>
        
      <div className="w-full max-w-none px-1">
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
