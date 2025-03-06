
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  DescriptionSection,
  LocationSection,
  ContactSection,
  FacilitiesSection
} from './sections';

interface CemeteryInfoEditFormProps {
  cemetery: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CemeteryInfoEditForm = ({ cemetery, onSave, onCancel }: CemeteryInfoEditFormProps) => {
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const form = useForm({
    defaultValues: {
      Descrizione: cemetery.Descrizione || "",
      Note: cemetery.Note || "",
      Indirizzo: cemetery.Indirizzo || "",
      city: cemetery.city || "",
      postal_code: cemetery.postal_code || "",
      state: cemetery.state || "",
      country: cemetery.country || "",
      established_date: cemetery.established_date || "",
      total_area_sqm: cemetery.total_area_sqm || "",
      Latitudine: cemetery.Latitudine || "",
      Longitudine: cemetery.Longitudine || "",
      contact_info: {
        phone: cemetery.contact_info?.phone || "",
        email: cemetery.contact_info?.email || "",
        website: cemetery.contact_info?.website || ""
      },
      ricevimento_salme: cemetery.ricevimento_salme,
      chiesa: cemetery.chiesa,
      camera_mortuaria: cemetery.camera_mortuaria,
      cavalletti: cemetery.cavalletti,
      impalcatura: cemetery.impalcatura
    }
  });

  const getGPSCoordinates = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "La geolocalizzazione non è supportata da questo browser."
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success - Update form with coordinates
        form.setValue('Latitudine', position.coords.latitude.toString());
        form.setValue('Longitudine', position.coords.longitude.toString());
        setIsGettingLocation(false);
        
        toast({
          title: "Posizione acquisita",
          description: "Le coordinate GPS sono state aggiornate con successo."
        });
      },
      (error) => {
        // Error
        setIsGettingLocation(false);
        let errorMessage = "Impossibile ottenere la posizione";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permesso di geolocalizzazione negato.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informazioni sulla posizione non disponibili.";
            break;
          case error.TIMEOUT:
            errorMessage = "Richiesta di posizione scaduta.";
            break;
        }
        
        toast({
          variant: "destructive",
          title: "Errore di geolocalizzazione",
          description: errorMessage
        });
      }
    );
  };

  return (
    <Card className="w-full shadow-sm relative">
      <CardContent className="space-y-6 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <DescriptionSection control={form.control} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationSection 
                control={form.control} 
                isGettingLocation={isGettingLocation} 
                getGPSCoordinates={getGPSCoordinates} 
              />
              <ContactSection control={form.control} />
            </div>

            <FacilitiesSection control={form.control} />

            <div className="flex justify-end space-x-2 py-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onCancel}
              >
                Annulla
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-1" />
                Salva
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CemeteryInfoEditForm;
