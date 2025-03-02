
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Info, Users, Calendar, Phone, Mail, Map } from "lucide-react";
import { formatDate } from "@/lib/utils";

const Index = () => {
  const [cimiteri, setCimiteri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCimiteri, setFilteredCimiteri] = useState([]);

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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">
        <section className="mb-12">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Benvenuto nel sistema di gestione cimiteriale</CardTitle>
              <CardDescription>
                Accedi a tutti i dati e le funzionalità per la gestione delle strutture cimiteriali
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <Button className="flex items-center gap-2">
                  <MapPin size={18} />
                  Cimiteri
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Users size={18} />
                  Defunti
                </Button>
                <Button variant="secondary" className="flex items-center gap-2">
                  <Info size={18} />
                  Loculi
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Map size={18} />
                  Mappa
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold mb-4 md:mb-0">Elenco Cimiteri</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCimiteri.map((cimitero) => (
                <Card key={cimitero.Id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {cimitero.nome || "Cimitero"}
                    </CardTitle>
                    <CardDescription className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{cimitero.Indirizzo || "Indirizzo non disponibile"}{cimitero.city && `, ${cimitero.city}`}{cimitero.state && `, ${cimitero.state}`}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {cimitero.Descrizione || "Nessuna descrizione disponibile"}
                      </p>
                      
                      {cimitero.established_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Fondato: {formatDate(cimitero.established_date, "short")}</span>
                        </div>
                      )}
                      
                      {cimitero.contact_info && (
                        <div className="space-y-1">
                          {cimitero.contact_info.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{cimitero.contact_info.phone}</span>
                            </div>
                          )}
                          {cimitero.contact_info.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{cimitero.contact_info.email}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full flex items-center gap-2">
                      <Link to={`/cemetery/${cimitero.Id}`}>
                        <Info size={16} />
                        Visualizza dettagli
                      </Link>
                    </Button>
                  </CardFooter>
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
