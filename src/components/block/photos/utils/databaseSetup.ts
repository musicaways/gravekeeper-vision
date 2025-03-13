
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the blocco_foto table exists, and creates it if it doesn't
 * @returns A Promise that resolves to a boolean indicating if the table is ready
 */
export const ensureBlockPhotoTableExists = async (): Promise<boolean> => {
  try {
    // First directly check if we can query the table
    const { data: testData, error: testError } = await supabase
      .from('blocco_foto')
      .select('count(*)', { count: 'exact', head: true });
    
    // If no error, the table exists
    if (!testError) {
      return true;
    }
    
    // If error is not about table not existing, it's a different problem
    if (!testError.message.includes('relation "public.blocco_foto" does not exist')) {
      console.error("Error checking blocco_foto table:", testError);
      return false;
    }
    
    // If table doesn't exist, create it
    const { error: createError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.blocco_foto (
          "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "IdBlocco" INTEGER NOT NULL,
          "NomeFile" TEXT,
          "TipoFile" TEXT,
          "Descrizione" TEXT,
          "Url" TEXT NOT NULL,
          "DataInserimento" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Ensure the UUID extension is available
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        -- Add foreign key constraint if the Blocco table exists
        DO $$
        BEGIN
          IF EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'Blocco'
          ) THEN
            BEGIN
              ALTER TABLE public.blocco_foto 
              ADD CONSTRAINT blocco_foto_idblocco_fkey 
              FOREIGN KEY ("IdBlocco") REFERENCES public."Blocco"("Id");
            EXCEPTION WHEN duplicate_object THEN
              -- Constraint already exists, ignore
              NULL;
            END;
          END IF;
        END $$;
      `
    });
    
    if (createError) {
      console.error("Error creating table:", createError);
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
    
    // Try to create the bucket using SQL
    const { error: createError } = await supabase.rpc('execute_sql', {
      sql: `
        DO $$
        BEGIN
          -- Try to create the bucket
          BEGIN
            INSERT INTO storage.buckets (id, name, public)
            VALUES ('cimitero-foto', 'Foto dei Blocchi Cimitero', true);
          EXCEPTION WHEN unique_violation THEN
            -- Bucket already exists, ignore
            NULL;
          END;
          
          -- Create a policy to allow public read access
          BEGIN
            INSERT INTO storage.policies (name, definition, bucket_id)
            VALUES ('Public Read Access', '(bucket_id = ''cimitero-foto''::text)', 'cimitero-foto');
          EXCEPTION WHEN unique_violation THEN
            -- Policy already exists, ignore
            NULL;
          END;
          
          -- Create a policy for authenticated uploads
          BEGIN
            INSERT INTO storage.policies (name, definition, bucket_id)
            VALUES ('Authenticated Uploads', '(bucket_id = ''cimitero-foto''::text AND auth.role() = ''authenticated''::text)', 'cimitero-foto');
          EXCEPTION WHEN unique_violation THEN
            -- Policy already exists, ignore
            NULL;
          END;
        END $$;
      `
    });
    
    if (createError) {
      console.error("Error creating bucket with SQL:", createError);
      return false;
    }
    
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
