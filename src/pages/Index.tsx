import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [cimiteri, setCimiteri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCimiteri, setFilteredCimiteri] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const globalSearch = params.get('search');
    if (globalSearch) {
      setSearchTerm(globalSearch);
    } else {
      setSearchTerm("");
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCimiteri = async () => {
      try {
        const { data, error } = await supabase
          .from('Cimitero')
          .select('*')
          .order('nome', { ascending: true });
        
        if (error) throw error;
        setCimiteri(data || []);
      } catch (error) {
        console.error("Errore nel caricamento dei cimiteri:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCimiteri();
  }, []);

  useEffect(() => {
    if (!cimiteri.length) {
      setFilteredCimiteri([]);
      return;
    }
    
    if (searchTerm.trim() === "") {
      setFilteredCimiteri(cimiteri);
    } else {
      const normalizedSearch = searchTerm.toLowerCase().trim();
      const filtered = cimiteri.filter((cimitero) => 
        (cimitero.nome?.toLowerCase() || "").includes(normalizedSearch) ||
        (cimitero.Nome?.toLowerCase() || "").includes(normalizedSearch) ||
        (cimitero.city?.toLowerCase() || "").includes(normalizedSearch) ||
        (cimitero.Indirizzo?.toLowerCase() || "").includes(normalizedSearch)
      );
      setFilteredCimiteri(filtered);
    }
  }, [searchTerm, cimiteri]);

  const handleCardClick = (id) => {
    console.log("Navigating to cemetery:", id);
    navigate(`/cemetery/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full max-w-none px-0">
        <section className="container mx-auto px-4 py-2">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredCimiteri.length > 0 ? (
            <div className="container px-0 mx-auto">
              {filteredCimiteri.map((cimitero) => (
                <Card 
                  key={cimitero.Id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer w-full border-0 mb-8"
                  onClick={() => handleCardClick(cimitero.Id)}
                >
                  <div className="relative h-48 md:h-64 w-full overflow-hidden">
                    <img 
                      src={cimitero.FotoCopertina || "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&h=400&q=80"} 
                      alt={cimitero.Nome || cimitero.nome || "Cimitero"} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-black/30"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full">
                      <div className="bg-gradient-to-t from-black/80 to-black/30 p-4 w-full backdrop-blur-sm">
                        <h3 className="text-white text-xl font-medium tracking-tight group-hover:text-primary-light transition-colors">
                          {cimitero.Nome || cimitero.nome || "Cimitero"}
                        </h3>
                        <p className="text-white/90 text-sm mt-1">
                          {cimitero.Indirizzo || cimitero.city || "Indirizzo non disponibile"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  {searchTerm ? "Nessun cimitero trovato con i criteri di ricerca specificati" : "Nessun cimitero trovato nel database"}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
