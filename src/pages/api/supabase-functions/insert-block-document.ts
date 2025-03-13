
import { supabase } from "@/integrations/supabase/client";

// Define types to replace Next.js types
interface RequestData {
  idblocco: number;
  nomefile: string;
  descrizione?: string;
  tipofile?: string;
  url: string;
  datainserimento: string;
}

interface Request {
  method: string;
  body: string | null;
}

interface Response {
  status: (code: number) => Response;
  json: (data: any) => void;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      console.error("Authentication error:", sessionError);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Parse request body
    const requestBody: RequestData = req.body ? JSON.parse(req.body) : {};
    
    // Call the Supabase Edge Function
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/insert-block-document`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error calling the Edge Function');
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
