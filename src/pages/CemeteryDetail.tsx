import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";
import { MapPin, Info, Users, Calendar, Phone, Mail, MapIcon, ArrowLeft, Clock, Globe, Home, Map } from "lucide-react";

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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !cemetery) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Errore</CardTitle>
            <CardDescription>
              Si è verificato un errore nel caricamento dei dettagli del cimitero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error || "Cimitero non trovato"}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Torna alla lista dei cimiteri
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formatOperatingHours = (hours) => {
    if (!hours) return "Orari non disponibili";
    
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayNames = {
      "monday": "Lunedì",
      "tuesday": "Martedì",
      "wednesday": "Mercoledì",
      "thursday": "Giovedì",
      "friday": "Venerdì",
      "saturday": "Sabato",
      "sunday": "Domenica"
    };
    
    return (
      <div className="space-y-2">
        {daysOfWeek.map(day => (
          hours[day] ? (
            <div key={day} className="flex justify-between">
              <span className="font-medium">{dayNames[day]}:</span>
              <span>{hours[day].open} - {hours[day].close}</span>
            </div>
          ) : null
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <div className="container mx-auto">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Torna alla lista
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{cemetery.nome || "Dettagli Cimitero"}</h1>
          <p className="text-xl opacity-90">{cemetery.city && cemetery.state ? `${cemetery.city}, ${cemetery.state}` : cemetery.Indirizzo}</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Generali</CardTitle>
                <CardDescription>Dati principali e informazioni sul cimitero</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {cemetery.Descrizione && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Descrizione</h3>
                    <p>{cemetery.Descrizione}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Indirizzo</h4>
                        <p>{cemetery.Indirizzo || "Non disponibile"}</p>
                        <p>{cemetery.city && cemetery.postal_code ? `${cemetery.city}, ${cemetery.postal_code}` : ""}</p>
                        <p>{cemetery.state && cemetery.country ? `${cemetery.state}, ${cemetery.country}` : ""}</p>
                      </div>
                    </div>

                    {cemetery.established_date && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Data di fondazione</h4>
                          <p>{formatDate(cemetery.established_date, "long")}</p>
                        </div>
                      </div>
                    )}

                    {cemetery.total_area_sqm && (
                      <div className="flex items-start gap-3">
                        <Map className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Area totale</h4>
                          <p>{cemetery.total_area_sqm} m²</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {cemetery.contact_info && cemetery.contact_info.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Telefono</h4>
                          <p>{cemetery.contact_info.phone}</p>
                        </div>
                      </div>
                    )}

                    {cemetery.contact_info && cemetery.contact_info.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Email</h4>
                          <p>{cemetery.contact_info.email}</p>
                        </div>
                      </div>
                    )}

                    {cemetery.contact_info && cemetery.contact_info.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Sito Web</h4>
                          <a href={cemetery.contact_info.website} target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:underline">
                            {cemetery.contact_info.website}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Stato</h4>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cemetery.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {cemetery.active ? 'Attivo' : 'Non attivo'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="sections" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sections">Settori</TabsTrigger>
                <TabsTrigger value="deceased">Defunti</TabsTrigger>
                <TabsTrigger value="map">Mappa</TabsTrigger>
              </TabsList>
              <TabsContent value="sections" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapIcon className="h-5 w-5" />
                      Settori del cimitero
                    </CardTitle>
                    <CardDescription>
                      Visualizza e gestisci le diverse aree e settori del cimitero
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">Nessun settore disponibile per questo cimitero</p>
                      <Button variant="outline" className="mt-4">
                        Aggiungi un nuovo settore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="deceased" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Elenco defunti
                    </CardTitle>
                    <CardDescription>
                      Visualizza e gestisci l'elenco dei defunti sepolti in questo cimitero
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">Nessun dato disponibile sui defunti in questo cimitero</p>
                      <Button variant="outline" className="mt-4">
                        Aggiungi un nuovo defunto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="map" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5" />
                      Mappa del cimitero
                    </CardTitle>
                    <CardDescription>
                      Visualizza la mappa interattiva del cimitero
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">Mappa non disponibile per questo cimitero</p>
                      <Button variant="outline" className="mt-4">
                        Carica una mappa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Orari di apertura
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cemetery.operating_hours ? 
                  formatOperatingHours(cemetery.operating_hours) :
                  <p className="text-muted-foreground text-center py-4">Orari non disponibili</p>
                }
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Amministrazione
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Gestione personale
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Pianifica manutenzione
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Info className="mr-2 h-4 w-4" />
                  Visualizza statistiche
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-6 mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sistema Gestione Cimiteriale - Tutti i diritti riservati
        </div>
      </footer>
    </div>
  );
};

export default CemeteryDetail;
