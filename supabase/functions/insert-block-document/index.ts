
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
    // Create a Supabase client with the service role key (bypasses RLS)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { idblocco, nomefile, descrizione, tipofile, url, datainserimento } = await req.json();

    console.log("Attempting to insert document:", { idblocco, nomefile });

    // Insert into the bloccodocumenti table with admin privileges
    const { data, error } = await supabaseClient
      .from('bloccodocumenti')
      .insert({
        idblocco: idblocco,
        nomefile: nomefile,
        descrizione: descrizione,
        tipofile: tipofile,
        url: url,
        datainserimento: datainserimento
      });

    if (error) {
      console.error("Error inserting document:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
