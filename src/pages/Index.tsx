
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [cimiteri, setCimiteri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCimiteri, setFilteredCimiteri] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCimiteri = async () => {
      try {
        const { data, error } = await supabase
          .from('Cimitero')
          .select('*')
          .order('nome', { ascending: true });
        
        if (error) throw error;
        setCimiteri(data || []);
        setFilteredCimiteri(data || []);
      } catch (error) {
        console.error("Errore nel caricamento dei cimiteri:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCimiteri();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCimiteri(cimiteri);
    } else {
      const filtered = cimiteri.filter((cimitero) => 
        cimitero.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cimitero.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cimitero.Indirizzo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCimiteri(filtered);
    }
  }, [searchTerm, cimiteri]);

  const handleCardClick = (id) => {
    navigate(`/cemetery/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full px-4 py-8">
        <section>
          <div className="flex justify-end mb-6">
            <div className="w-full md:w-1/3">
              <Input
                type="search"
                placeholder="Cerca per nome, città o indirizzo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredCimiteri.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredCimiteri.map((cimitero) => (
                <Card 
                  key={cimitero.Id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => handleCardClick(cimitero.Id)}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={cimitero.FotoCopertina || "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80"} 
                      alt={cimitero.Nome || cimitero.nome || "Cimitero"} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    
                    {/* Semi-transparent black bar with similar opacity to the image */}
                    <div className="absolute bottom-0 left-0 w-full">
                      <div className="bg-black/80 p-4 w-full backdrop-blur-sm">
                        <h3 className="text-white text-xl font-medium truncate group-hover:text-primary-light transition-colors">
                          {cimitero.Nome || cimitero.nome || "Cimitero"}
                        </h3>
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
