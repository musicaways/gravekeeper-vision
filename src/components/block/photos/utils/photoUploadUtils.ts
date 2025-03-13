
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { compressImage } from "./imageCompression";

/**
 * Prepares an image file for upload by compressing it if necessary
 * @param file The original file to prepare
 * @returns The prepared file (compressed if needed)
 */
export const prepareImageForUpload = async (file: File): Promise<Blob | File> => {
  // Compress if larger than 2MB
  if (file.size > 2 * 1024 * 1024) {
    return await compressImage(file);
  }
  return file;
};

/**
 * Generates a unique filename for the uploaded image
 * @param originalFileName The original file name
 * @returns A unique filename with the original extension
 */
export const generateUniqueFileName = (originalFileName: string): string => {
  const fileExt = originalFileName.split('.').pop();
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
};

/**
 * Creates a database record for the uploaded photo
 * @param blockId The block ID
 * @param file The file being uploaded
 * @param fileName The generated unique filename
 * @param description Optional description for the photo
 * @returns Success flag and error if any
 */
export const createPhotoRecord = async (
  blockId: string,
  file: File,
  fileName: string,
  description: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('blocco_foto')
      .insert({
        IdBlocco: parseInt(blockId, 10),
        NomeFile: file.name,
        Descrizione: description,
        TipoFile: file.type,
        Url: `https://ytfuenxlejrogesnsvhl.supabase.co/storage/v1/object/public/cimitero-foto/${blockId}/${fileName}`,
        DataInserimento: new Date().toISOString()
      });
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error creating photo record:", error);
    return { success: false, error };
  }
};

/**
 * Uploads the file to Supabase storage
 * @param blockId The block ID
 * @param fileName The unique filename
 * @param fileContent The prepared file content
 * @returns Success flag and error if any
 */
export const uploadFileToStorage = async (
  blockId: string,
  fileName: string,
  fileContent: Blob | File
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase.storage
      .from('cimitero-foto')
      .upload(`${blockId}/${fileName}`, fileContent);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error uploading file to storage:", error);
    return { success: false, error };
  }
};

/**
 * Shows a toast notification based on the upload result
 * @param success Whether the upload was successful
 */
export const showUploadResultToast = (success: boolean): void => {
  if (success) {
    toast({
      title: "Foto caricata",
      description: "La foto è stata caricata con successo.",
    });
  } else {
    toast({
      title: "Errore",
      description: "Si è verificato un errore durante il caricamento.",
      variant: "destructive"
    });
  }
};
