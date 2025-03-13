
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { BlockFormData } from "../../types/blockFormTypes";

export const useLocationHandlers = (form: UseFormReturn<BlockFormData>) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const { toast } = useToast();

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

  return {
    isGettingLocation,
    showMapSelector,
    setShowMapSelector,
    getGPSCoordinates,
    handleMapLocationSelect,
    getInitialCoordinates
  };
};
