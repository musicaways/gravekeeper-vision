
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CemeteryHeader from "@/components/cemetery/CemeteryHeader";
import CemeteryInfoCard from "@/components/cemetery/CemeteryInfoCard";
import CemeteryHours from "@/components/cemetery/CemeteryHours";
import CemeteryAdministration from "@/components/cemetery/CemeteryAdministration";
import { CemeteryTabs } from "@/components/cemetery/CemeteryTabs";
import CemeteryGallery from "@/components/cemetery/CemeteryGallery";
import CemeteryErrorDisplay from "@/components/cemetery/CemeteryErrorDisplay";
import CemeteryLoading from "@/components/cemetery/CemeteryLoading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

const CemeteryDetail = () => {
  const { id } = useParams();
  const [cemetery, setCemetery] = useState(null);
  const [photos, setPhotos] = useState([]);
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
        
        // Fetch cemetery photos
        const { data: photosData, error: photosError } = await supabase
          .from('CimiteroFoto')
          .select('*')
          .eq('IdCimitero', numericId);
          
        if (photosError) {
          console.error("Errore nel caricamento delle foto:", photosError);
        } else {
          setPhotos(photosData || []);
        }
        
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

  const locationString = cemetery.city && cemetery.state ? `${cemetery.city}, ${cemetery.state}` : cemetery.Indirizzo;

  return (
    <div className="min-h-screen bg-background">
      <CemeteryHeader 
        name={cemetery.nome || "Dettagli Cimitero"} 
        location={locationString} 
      />

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {photos.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Galleria Foto
                  </CardTitle>
                  <CardDescription>
                    Visualizza le immagini del cimitero
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CemeteryGallery photos={photos} columns={3} aspect="square" />
                </CardContent>
              </Card>
            )}

            <CemeteryInfoCard cemetery={cemetery} />
            <CemeteryTabs cemetery={cemetery} cemeteryId={id || ''} />
          </div>

          <div>
            <CemeteryHours operatingHours={cemetery.operating_hours} />
            <CemeteryAdministration />
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
