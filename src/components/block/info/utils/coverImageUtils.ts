
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "../../photos/utils/imageCompression";

/**
 * Uploads a block cover image to Supabase storage
 * 
 * @param blockId The block ID
 * @param file The image file to upload
 * @returns The URL of the uploaded image or null if the upload failed
 */
export const uploadBlockCoverImage = async (blockId: number | string, file: File): Promise<string | null> => {
  try {
    console.log(`Starting cover image upload for block ${blockId}`);

    // First compress the image to reduce size
    const compressedImage = await compressImage(file);
    console.log("Image compressed successfully");
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `cover-${blockId}-${Date.now()}.${fileExt}`;
    
    console.log(`Uploading to block-covers bucket with filename: ${fileName}`);
    
    // Upload to block-covers bucket (bucket should exist now)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('block-covers')
      .upload(fileName, compressedImage, {
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) {
      console.error("Error uploading cover image:", uploadError);
      return null;
    }
    
    console.log("Image uploaded successfully, getting public URL");
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('block-covers')
      .getPublicUrl(fileName);
    
    console.log("Public URL obtained:", publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error processing cover image:", error);
    return null;
  }
};
