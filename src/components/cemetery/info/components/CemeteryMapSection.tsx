
import React, { useState, useEffect } from "react";
import { Map, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface CemeteryMapSectionProps {
  cemeteryId: string | number;
}

const CemeteryMapSection = ({ cemeteryId }: CemeteryMapSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [cemetery, setCemetery] = useState<any>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCemeteryData = async () => {
      try {
        if (!cemeteryId) return;

        // Convert cemeteryId to number if it's a string
        const numericId = typeof cemeteryId === 'string' ? parseInt(cemeteryId, 10) : cemeteryId;
        
        // Check if the conversion resulted in a valid number
        if (isNaN(numericId)) {
          console.error("Invalid cemetery ID format:", cemeteryId);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('Cimitero')
          .select('Indirizzo, Latitudine, Longitudine, city, postal_code, state, country')
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        setCemetery(data);
        
        // Generate Google Maps URL based on coordinates or address
        if (data.Latitudine && data.Longitudine) {
          // Use coordinates if available
          setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyDfDnGw_IVT0l3YNVqp0JQ6NZjrP5ybviU&q=${data.Latitudine},${data.Longitudine}&zoom=16`);
        } else if (data.Indirizzo) {
          // Use address if coordinates not available
          const address = [
            data.Indirizzo,
            data.city,
            data.postal_code,
            data.state,
            data.country
          ].filter(Boolean).join(', ');
          
          setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyDfDnGw_IVT0l3YNVqp0JQ6NZjrP5ybviU&q=${encodeURIComponent(address)}&zoom=16`);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati del cimitero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryData();
  }, [cemeteryId]);

  const handleOpenMapInNewTab = () => {
    if (!cemetery) return;
    
    let url = "";
    if (cemetery.Latitudine && cemetery.Longitudine) {
      // Use coordinates if available
      url = `https://www.google.com/maps/search/?api=1&query=${cemetery.Latitudine},${cemetery.Longitudine}`;
    } else if (cemetery.Indirizzo) {
      // Use address if coordinates not available
      const address = [
        cemetery.Indirizzo,
        cemetery.city,
        cemetery.postal_code,
        cemetery.state,
        cemetery.country
      ].filter(Boolean).join(', ');
      
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <Map className="h-5 w-5 text-primary mr-2.5" />
        <h3 className="text-base font-medium text-foreground">Mappa del cimitero</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="ml-2">Caricamento mappa...</span>
        </div>
      ) : mapUrl ? (
        <div className="space-y-2">
          <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2">
            <iframe 
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa del cimitero"
            ></iframe>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenMapInNewTab}
              className="flex items-center gap-1 text-xs"
            >
              <Navigation className="h-3.5 w-3.5" />
              Apri in Google Maps
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-muted/30 rounded-md">
          <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground mb-2">Posizione non disponibile per questo cimitero</p>
        </div>
      )}
    </div>
  );
};

export default CemeteryMapSection;
