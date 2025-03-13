
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { decodeText } from "@/utils/textFormatters";
import { Save, MapPin, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { blockFormSchema, BlockFormData } from "./types/blockFormTypes";
import { useBlockFormSubmit } from "./hooks/useBlockFormSubmit";
import MapSelectorDialog from "./form/map-selector/MapSelectorDialog";
import CoverImageSection from "./form/sections/CoverImageSection";
import { 
  BasicInfoSection,
  NumericInfoSection,
  TextAreaSection,
  LocationSection
} from "./form/sections";

interface BlockInfoEditFormProps {
  block: any;
  onSave: (data: BlockFormData) => void;
  onCancel: () => void;
}

const BlockInfoEditForm: React.FC<BlockInfoEditFormProps> = ({ block, onSave, onCancel }) => {
  const { toast } = useToast();
  const { submitBlockForm, isSubmitting } = useBlockFormSubmit({ 
    blockId: block.Id,
    onSuccess: () => {} // We'll handle success in the onSubmit function
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Inizializzazione del form con i valori convertiti correttamente
  const form = useForm<BlockFormData>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      Nome: decodeText(block.Nome) || "",
      Codice: decodeText(block.Codice) || "",
      Descrizione: decodeText(block.Descrizione) || "",
      Note: decodeText(block.Note) || "",
      Indirizzo: decodeText(block.Indirizzo) || "",
      NumeroLoculi: block.NumeroLoculi !== null ? String(block.NumeroLoculi) : "",
      NumeroFile: block.NumeroFile !== null ? String(block.NumeroFile) : "",
      Latitudine: block.Latitudine !== null ? String(block.Latitudine) : "",
      Longitudine: block.Longitudine !== null ? String(block.Longitudine) : "",
      DataCreazione: block.DataCreazione || "",
      coverImage: null
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

  const handleMapLocationSelect = (lat: number, lng: number) => {
    form.setValue('Latitudine', lat.toString(), { shouldValidate: true });
    form.setValue('Longitudine', lng.toString(), { shouldValidate: true });
    setShowMapSelector(false);
  };

  // Get initial coordinates for the map
  const getInitialCoordinates = () => {
    const latValue = form.getValues('Latitudine');
    const lngValue = form.getValues('Longitudine');
    
    return {
      lat: latValue ? parseFloat(latValue) : undefined,
      lng: lngValue ? parseFloat(lngValue) : undefined
    };
  };

  async function onSubmit(data: BlockFormData) {
    setIsUploading(true);
    try {
      console.log("Form data submitted:", data);
      
      // Check if there's a new cover image to upload
      let coverImageUrl = block.FotoCopertina;
      
      if (data.coverImage instanceof File) {
        const { uploadBlockCoverImage } = await import("./utils/coverImageUtils");
        const newImageUrl = await uploadBlockCoverImage(block.Id, data.coverImage);
        if (newImageUrl) {
          coverImageUrl = newImageUrl;
        } else {
          toast({
            variant: "destructive",
            title: "Errore",
            description: "Impossibile caricare l'immagine di copertina. Le altre informazioni verranno aggiornate."
          });
        }
      }
      
      // Add the cover image URL to the form data
      const dataToSave = {
        ...data,
        FotoCopertina: coverImageUrl
      };
      
      // Remove the File object as it can't be sent to the API
      delete dataToSave.coverImage;
      
      const success = await submitBlockForm(dataToSave);
      if (success) {
        onSave(dataToSave);
      }
    } catch (error: any) {
      console.error("Error saving block data:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: `Non è stato possibile salvare le modifiche: ${error.message || 'Riprova più tardi'}`,
      });
    } finally {
      setIsUploading(false);
    }
  }

  const { lat: initialLat, lng: initialLng } = getInitialCoordinates();

  return (
    <div className="w-full mb-6">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CoverImageSection 
              control={form.control} 
              defaultImage={block.FotoCopertina} 
            />
            
            <BasicInfoSection control={form.control} />
            
            <div className="space-y-6">
              <TextAreaSection 
                control={form.control}
                name="Descrizione"
                label="Descrizione"
                placeholder="Inserisci una descrizione del blocco"
              />
              
              <TextAreaSection 
                control={form.control}
                name="Note"
                label="Note"
                placeholder="Inserisci eventuali note"
              />
            </div>
            
            <LocationSection
              control={form.control}
              isGettingLocation={isGettingLocation}
              getGPSCoordinates={getGPSCoordinates}
              onOpenMapSelector={() => setShowMapSelector(true)}
            />
            
            <NumericInfoSection control={form.control} />
            
            <div className="flex justify-end space-x-2 py-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onCancel}
                disabled={isSubmitting || isUploading}
              >
                Annulla
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || isUploading}
              >
                <Save className="h-4 w-4 mr-1" />
                {isSubmitting || isUploading ? "Salvataggio in corso..." : "Salva"}
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
      
      <MapSelectorDialog
        isOpen={showMapSelector}
        onOpenChange={setShowMapSelector}
        onSelectLocation={handleMapLocationSelect}
        initialLat={initialLat}
        initialLng={initialLng}
      />
    </div>
  );
};

export default BlockInfoEditForm;
