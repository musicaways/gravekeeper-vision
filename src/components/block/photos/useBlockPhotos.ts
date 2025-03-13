
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
      
      // Use rpc with a raw SQL query to bypass TypeScript type checking
      const { data, error: queryError } = await supabase
        .rpc('execute_sql', {
          sql: `SELECT * FROM public.blocco_foto WHERE "IdBlocco" = ${numericId} ORDER BY "DataInserimento" DESC`
        });
      
      if (queryError) {
        console.error("Error fetching photos:", queryError);
        setError("Si è verificato un errore durante il caricamento delle foto");
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento delle foto",
          variant: "destructive"
        });
      } else {
        // Since execute_sql doesn't return the actual data directly, we need to parse the results
        // The results will be in the first element of the data array if successful
        const photosData = data !== null && Array.isArray(data) && data.length > 0 ? data : [];
        setPhotos(photosData as unknown as BlockPhoto[]);
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
      // First, get the photo URL to extract the path using a raw SQL query
      const { data, error: photoError } = await supabase
        .rpc('execute_sql', {
          sql: `SELECT "Url" FROM public.blocco_foto WHERE "Id" = '${photoId}'`
        });
      
      // Check if data exists and has the expected structure
      if (photoError || !data) {
        throw photoError || new Error("Photo not found");
      }
      
      // Safely access the data array
      const resultArray = Array.isArray(data) ? data : [];
      if (resultArray.length === 0) {
        throw new Error("Photo not found");
      }
      
      // Extract the URL from the result (type assertion to any to access properties)
      const firstResult = resultArray[0] as any;
      const photoUrl = firstResult?.Url;
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
      
      // Delete the record from the database using a raw query approach
      const { error: dbError } = await supabase
        .rpc('execute_sql', {
          sql: `DELETE FROM public.blocco_foto WHERE "Id" = '${photoId}'`
        });
      
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
