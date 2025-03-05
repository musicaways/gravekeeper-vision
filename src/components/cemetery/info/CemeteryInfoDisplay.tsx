
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Phone, Mail, Globe, Map, Check, X, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CemeteryInfoDisplayProps {
  cemetery: any;
  onEditClick: () => void;
}

const CemeteryInfoDisplay = ({ cemetery, onEditClick }: CemeteryInfoDisplayProps) => {
  const { user } = useAuth();
  const canEdit = !!user;
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCemeteryMap = async () => {
      try {
        if (!cemetery || !cemetery.Id) return;

        const { data, error } = await supabase
          .from('CimiteroMappe')
          .select('Url')
          .eq('IdCimitero', cemetery.Id)
          .order('DataInserimento', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMapUrl(data[0].Url);
        }
      } catch (err) {
        console.error("Errore nel caricamento della mappa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryMap();
  }, [cemetery]);

  const renderBooleanField = (label: string, value: boolean | null | undefined) => {
    if (value === null || value === undefined) return null;
    
    return (
      <div className="flex items-start gap-3">
        {value ? 
          <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> : 
          <X className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
        }
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm md:text-base">{value ? 'Sì' : 'No'}</p>
        </div>
      </div>
    );
  };

  const formatMultilineText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <p key={i} className="text-sm md:text-base mb-1">
        {line || <br />}
      </p>
    ));
  };

  const hasFacilities = cemetery.ricevimento_salme !== null || 
                       cemetery.chiesa !== null || 
                       cemetery.camera_mortuaria !== null || 
                       cemetery.cavalletti !== null || 
                       cemetery.impalcatura !== null;

  return (
    <Card className="w-full shadow-sm relative mx-auto">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-6">
          {cemetery.Descrizione && (
            <div className="w-full">
              <h3 className="text-sm font-medium mb-2">Descrizione</h3>
              <div className="p-4 rounded-md w-full">
                {formatMultilineText(cemetery.Descrizione)}
              </div>
            </div>
          )}
          
          {cemetery.Note && (
            <div className="w-full">
              <h3 className="text-sm font-medium mb-2">Note</h3>
              <div className="p-4 rounded-md w-full">
                {formatMultilineText(cemetery.Note)}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Indirizzo</h4>
                  <p className="text-sm md:text-base">{cemetery.Indirizzo || "Non disponibile"}</p>
                  <p className="text-sm md:text-base">{cemetery.city && cemetery.postal_code ? `${cemetery.city}, ${cemetery.postal_code}` : ""}</p>
                  <p className="text-sm md:text-base">{cemetery.state && cemetery.country ? `${cemetery.state}, ${cemetery.country}` : ""}</p>
                </div>
              </div>

              {cemetery.established_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Data di fondazione</h4>
                    <p className="text-sm md:text-base">{formatDate(cemetery.established_date, "long")}</p>
                  </div>
                </div>
              )}

              {cemetery.total_area_sqm && (
                <div className="flex items-start gap-3">
                  <Map className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Area totale</h4>
                    <p className="text-sm md:text-base">{cemetery.total_area_sqm} m²</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {cemetery.contact_info && cemetery.contact_info.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Telefono</h4>
                    <p className="text-sm md:text-base">{cemetery.contact_info.phone}</p>
                  </div>
                </div>
              )}

              {cemetery.contact_info && cemetery.contact_info.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm md:text-base break-words">{cemetery.contact_info.email}</p>
                  </div>
                </div>
              )}

              {cemetery.contact_info && cemetery.contact_info.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium">Sito Web</h4>
                    <a href={cemetery.contact_info.website} target="_blank" rel="noopener noreferrer" 
                       className="text-sm md:text-base text-primary hover:underline break-words">
                      {cemetery.contact_info.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {hasFacilities && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Strutture e servizi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {renderBooleanField("Ricevimento salme", cemetery.ricevimento_salme)}
                {renderBooleanField("Chiesa", cemetery.chiesa)}
                {renderBooleanField("Camera mortuaria", cemetery.camera_mortuaria)}
                {renderBooleanField("Cavalletti", cemetery.cavalletti)}
                {renderBooleanField("Impalcatura", cemetery.impalcatura)}
              </div>
            </div>
          )}
          
          {/* Map section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Map className="h-5 w-5" />
              Mappa del cimitero
            </h3>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="ml-2">Caricamento mappa...</span>
              </div>
            ) : mapUrl ? (
              <div className="rounded-md overflow-hidden border border-border h-[400px] mt-4">
                <img 
                  src={mapUrl} 
                  alt="Mappa del cimitero" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="text-center py-6 bg-muted/30 rounded-md">
                <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground mb-2">Mappa non disponibile per questo cimitero</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {canEdit && (
        <Button 
          onClick={onEditClick}
          size="icon"
          variant="secondary"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-md z-10 bg-primary-light hover:bg-primary-dark text-white transition-all duration-300"
        >
          <Edit className="h-5 w-5" />
        </Button>
      )}
    </Card>
  );
};

export default CemeteryInfoDisplay;
