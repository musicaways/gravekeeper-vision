
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if table exists
    const { data: checkResult, error: checkError } = await supabaseClient.rpc('execute_sql', {
      sql: `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'blocco_foto'
      )`
    });

    if (checkError) throw checkError;

    const exists = Array.isArray(checkResult) && checkResult.length > 0 ? checkResult[0].exists : false;
    
    if (!exists) {
      // Create the blocco_foto table
      const { error: createError } = await supabaseClient.rpc('execute_sql', {
        sql: `
          CREATE TABLE public.blocco_foto (
            "Id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "IdBlocco" integer NOT NULL,
            "NomeFile" text,
            "TipoFile" text,
            "Descrizione" text,
            "Url" text NOT NULL,
            "DataInserimento" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
          );
          
          -- Add foreign key to Blocco table
          ALTER TABLE public.blocco_foto 
          ADD CONSTRAINT blocco_foto_idblocco_fkey 
          FOREIGN KEY ("IdBlocco") 
          REFERENCES public."Blocco"("Id") 
          ON DELETE CASCADE;
          
          -- Create index for faster queries
          CREATE INDEX blocco_foto_idblocco_idx ON public.blocco_foto ("IdBlocco");
          
          -- Add RLS policies
          ALTER TABLE public.blocco_foto ENABLE ROW LEVEL SECURITY;
          
          -- Allow all operations for authenticated users
          CREATE POLICY blocco_foto_policy ON public.blocco_foto
          FOR ALL
          TO authenticated
          USING (true)
          WITH CHECK (true);
        `
      });
      
      if (createError) throw createError;
      
      return new Response(
        JSON.stringify({ success: true, message: "Table 'blocco_foto' created successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: true, message: "Table 'blocco_foto' already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
