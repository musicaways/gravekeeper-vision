
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Photo } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useCemeteryPhotos = (cemeteryId: string) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const numericId = parseInt(cemeteryId, 10);
      
      if (isNaN(numericId)) {
        console.error("ID cimitero non valido");
        setPhotos([]);
        return;
      }

      const { data, error } = await supabase
        .from('CimiteroFoto')
        .select('*')
        .eq('IdCimitero', numericId)
        .order('DataInserimento', { ascending: false });
        
      if (error) {
        console.error("Errore nel caricamento delle foto:", error);
      } else {
        setPhotos(data || []);
      }
    } catch (err) {
      console.error("Errore nel caricamento delle foto:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('CimiteroFoto')
        .delete()
        .eq('Id', photoId);
      
      if (error) throw error;
      
      await fetchPhotos();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Errore durante l'eliminazione della foto:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile eliminare la foto. Riprova più tardi.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [cemeteryId]);

  return {
    photos,
    loading,
    fetchPhotos,
    handleDeletePhoto
  };
};
