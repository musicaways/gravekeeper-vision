
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
      
      // First, directly try to query the table - if it exists, this will work
      const { data: directQueryData, error: directQueryError } = await supabase
        .from('blocco_foto')
        .select('*')
        .eq('IdBlocco', numericId)
        .order('DataInserimento', { ascending: false });
      
      if (directQueryError) {
        // If error is not about table not existing, it's a real error
        if (!directQueryError.message.includes('relation "public.blocco_foto" does not exist')) {
          console.error("Error fetching photos:", directQueryError);
          setError("Si è verificato un errore durante il caricamento delle foto");
          return;
        }
        
        // Table doesn't exist yet
        console.log("blocco_foto table doesn't exist yet");
        setPhotos([]);
        setLoading(false);
        return;
      }
      
      // If we got here, the query worked and table exists
      setPhotos(directQueryData as BlockPhoto[]);
      setError(null);
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
      // First, get the photo URL to extract the path using a raw SQL query
      const { data, error: photoError } = await supabase
        .from('blocco_foto')
        .select('Url')
        .eq('Id', photoId)
        .single();
      
      if (photoError || !data) {
        throw photoError || new Error("Photo not found");
      }
      
      const photoUrl = data.Url;
      if (!photoUrl) {
        throw new Error("URL not found for photo");
      }
      
      // Extract the path from the URL
      const url = new URL(photoUrl);
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
