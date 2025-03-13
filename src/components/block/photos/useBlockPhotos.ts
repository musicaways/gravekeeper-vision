
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BlockPhoto {
  Id: string;
  IdBlocco: number;
  NomeFile: string | null;
  TipoFile: string | null;
  Descrizione: string | null;
  Url: string;
  DataInserimento: string | null;
}

export const useBlockPhotos = (blockId: string) => {
  const [photos, setPhotos] = useState<BlockPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      
      const numericId = parseInt(blockId, 10);
      if (isNaN(numericId)) {
        setError("ID blocco non valido");
        return;
      }
      
      // Use raw SQL query to access the blocco_foto table
      const { data, error: queryError } = await supabase
        .from('blocco_foto')
        .select('*')
        .eq('IdBlocco', numericId)
        .order('DataInserimento', { ascending: false });
      
      if (queryError) {
        console.error("Error fetching photos:", queryError);
        setError("Si è verificato un errore durante il caricamento delle foto");
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento delle foto",
          variant: "destructive"
        });
      } else {
        setPhotos(data as BlockPhoto[] || []);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Si è verificato un errore durante il caricamento delle foto");
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento delle foto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [blockId, toast]);

  const deletePhoto = async (photoId: string): Promise<boolean> => {
    try {
      // First, get the photo URL to extract the path
      const { data: photoData, error: photoError } = await supabase
        .from('blocco_foto')
        .select('Url')
        .eq('Id', photoId)
        .single();
      
      if (photoError) throw photoError;
      
      // Extract the path from the URL
      const url = new URL(photoData.Url);
      const pathMatch = url.pathname.match(/\/object\/public\/cimitero-foto\/(.+)/);
      
      if (!pathMatch || !pathMatch[1]) {
        throw new Error("Impossibile estrarre il percorso del file");
      }
      
      const storagePath = pathMatch[1];
      
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('cimitero-foto')
        .remove([storagePath]);
      
      if (storageError) throw storageError;
      
      // Delete the record from the database
      const { error: dbError } = await supabase
        .from('blocco_foto')
        .delete()
        .eq('Id', photoId);
      
      if (dbError) throw dbError;
      
      // Update the local state
      setPhotos(photos.filter(photo => photo.Id !== photoId));
      
      toast({
        title: "Foto eliminata",
        description: "La foto è stata eliminata con successo",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione della foto",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return {
    photos,
    loading,
    error,
    refetch: fetchPhotos,
    deletePhoto
  };
};
