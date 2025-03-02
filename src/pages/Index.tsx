
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [cimiteri, setCimiteri] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCimiteri = async () => {
      try {
        const { data, error } = await supabase
          .from('Cimitero')
          .select('*')
          .limit(10);
        
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Gestione Cimiteri</h1>
          <p className="text-xl opacity-90">Sistema di gestione cimiteriale</p>
        </div>
      </header>

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
              <div className="flex flex-wrap gap-4">
                <Button>Cimiteri</Button>
                <Button variant="outline">Defunti</Button>
                <Button variant="secondary">Loculi</Button>
                <Button variant="ghost">Mappa</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Elenco Cimiteri</h2>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : cimiteri.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cimiteri.map((cimitero: any) => (
                <Card key={cimitero.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>{cimitero.nome || "Cimitero"}</CardTitle>
                    <CardDescription>{cimitero.indirizzo || "Indirizzo non disponibile"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {cimitero.descrizione || "Nessuna descrizione disponibile"}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Visualizza dettagli
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Nessun cimitero trovato nel database</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <footer className="bg-muted py-6 mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sistema Gestione Cimiteriale - Tutti i diritti riservati
        </div>
      </footer>
    </div>
  );
};

export default Index;
