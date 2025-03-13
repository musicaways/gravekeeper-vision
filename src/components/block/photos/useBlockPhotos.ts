
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
      
      // Check if table exists first
      const { data: tableExistsData, error: checkError } = await supabase
        .rpc('execute_sql', {
          sql: `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'blocco_foto'
          )`
        });
      
      if (checkError) {
        console.error("Error checking table existence:", checkError);
        setPhotos([]);
        setLoading(false);
        return;
      }
      
      // Safely check if table exists with proper type handling
      let exists = false;
      if (tableExistsData && Array.isArray(tableExistsData)) {
        // Explicitly cast to an array of records with potential 'exists' property
        const records = tableExistsData as Array<Record<string, unknown>>;
        if (records.length > 0 && records[0] && typeof records[0] === 'object') {
          exists = Boolean(records[0].exists);
        }
      }
        
      if (!exists) {
        console.log("blocco_foto table doesn't exist yet");
        setPhotos([]);
        setLoading(false);
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
        // Cast data with proper type checking
        let photosData: any[] = [];
        if (data && Array.isArray(data)) {
          photosData = data;
        }
        setPhotos(photosData as BlockPhoto[]);
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
      if (photoError || data === null) {
        throw photoError || new Error("Photo not found");
      }
      
      // Safely access the data array with explicit null checks
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
