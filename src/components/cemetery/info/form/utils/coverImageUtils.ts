
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "../../../photos/utils/imageCompression";

/**
 * Uploads a cemetery cover image to Supabase storage
 * 
 * @param cemeteryId The cemetery ID
 * @param file The image file to upload
 * @returns The URL of the uploaded image or null if the upload failed
 */
export const uploadCoverImage = async (cemeteryId: number | string, file: File): Promise<string | null> => {
  try {
    // First compress the image to reduce size
    const compressedImage = await compressImage(file);
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `cover-${cemeteryId}-${Date.now()}.${fileExt}`;
    
    // Upload to cemetery-covers bucket (will be created if it doesn't exist)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cemetery-covers')
      .upload(fileName, compressedImage, {
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) {
      console.error("Error uploading cover image:", uploadError);
      return null;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('cemetery-covers')
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error processing cover image:", error);
    return null;
  }
};
