
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the blocco_foto table exists, and creates it if it doesn't
 * @returns A Promise that resolves to a boolean indicating if the table is ready
 */
export const ensureBlockPhotoTableExists = async (): Promise<boolean> => {
  try {
    // First check if table exists
    const { data, error } = await supabase.rpc('execute_sql', {
      sql: `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'blocco_foto'
      )`
    });
    
    if (error) throw error;
    
    // Safely check the existence value with proper null checks
    const exists = data !== null && Array.isArray(data) && data.length > 0 
      ? data[0]?.exists === true 
      : false;
    
    // If table already exists, we're good
    if (exists) {
      return true;
    }
    
    // If table doesn't exist, call the edge function to create it
    const { error: functionError } = await supabase.functions.invoke("create_blocco_foto_table");
    
    if (functionError) {
      console.error("Error creating table:", functionError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking/creating blocco_foto table:", error);
    return false;
  }
};

/**
 * Creates a storage bucket for cemetery photos if it doesn't exist
 * @returns A Promise that resolves to a boolean indicating if the bucket is ready
 */
export const ensurePhotoStorageBucketExists = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) throw listError;
    
    const bucketExists = buckets.some(b => b.name === 'cimitero-foto');
    
    // If bucket already exists, we're good
    if (bucketExists) {
      return true;
    }
    
    // Create the bucket if it doesn't exist
    const { error: createError } = await supabase.storage.createBucket('cimitero-foto', {
      public: true, // Allow public access
      fileSizeLimit: 5242880, // 5MB
    });
    
    if (createError) throw createError;
    
    return true;
  } catch (error) {
    console.error("Error checking/creating storage bucket:", error);
    return false;
  }
};

/**
 * Ensures all necessary database resources exist for the photo gallery
 * @returns A Promise that resolves when setup is complete
 */
export const setupPhotoDatabaseResources = async (): Promise<void> => {
  try {
    // Run both setup processes in parallel
    const [tableReady, bucketReady] = await Promise.all([
      ensureBlockPhotoTableExists(),
      ensurePhotoStorageBucketExists()
    ]);
    
    if (!tableReady || !bucketReady) {
      console.warn("Photo database resources setup incomplete");
    }
  } catch (error) {
    console.error("Error setting up photo database resources:", error);
  }
};
