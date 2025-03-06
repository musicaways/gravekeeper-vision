
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "../utils/imageCompression";

interface UsePhotoUploadProps {
  cemeteryId: string;
  onSuccess: () => void;
}

export const usePhotoUpload = ({ cemeteryId, onSuccess }: UsePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadPhoto = async (file: File, description: string) => {
    if (!file || !cemeteryId) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      let fileToUpload: Blob | File = file;
      
      // Compress if larger than 2MB
      if (file.size > 2 * 1024 * 1024) {
        fileToUpload = await compressImage(file);
        setUploadProgress(30);
      }
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      setUploadProgress(50);
      
      // Upload to Supabase
      const { data, error } = await supabase
        .from('CimiteroFoto')
        .insert({
          IdCimitero: parseInt(cemeteryId, 10),
          NomeFile: file.name,
          Descrizione: description,
          TipoFile: file.type,
          Url: `https://ytfuenxlejrogesnsvhl.supabase.co/storage/v1/object/public/cimitero-foto/${cemeteryId}/${fileName}`,
          DataInserimento: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setUploadProgress(70);
      
      // Upload the actual file to storage
      const { error: storageError } = await supabase.storage
        .from('cimitero-foto')
        .upload(`${cemeteryId}/${fileName}`, fileToUpload);
      
      if (storageError) throw storageError;
      
      setUploadProgress(100);
      toast({
        title: "Foto caricata",
        description: "La foto è stata caricata con successo.",
      });
      
      onSuccess();
      return true;
    } catch (error) {
      console.error("Errore nel caricamento:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadPhoto
  };
};
