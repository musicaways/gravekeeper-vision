
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Key } from "lucide-react";

export function ApiSettings() {
  const [googleMapsKey, setGoogleMapsKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveGoogleMapsKey = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('api_keys')
        .upsert({ 
          id: '1', // Using a fixed ID for simplicity since we only need one row
          googlemaps_key: googleMapsKey,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("API key salvata con successo");
      setGoogleMapsKey("");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Errore nel salvare l'API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Keys
        </CardTitle>
        <CardDescription>
          Gestisci le chiavi API per i servizi esterni
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="googlemaps" className="text-sm font-medium">
            Google Maps API Key
          </label>
          <div className="flex gap-2">
            <Input
              id="googlemaps"
              type="password"
              placeholder="Inserisci la tua API key di Google Maps"
              value={googleMapsKey}
              onChange={(e) => setGoogleMapsKey(e.target.value)}
            />
            <Button 
              onClick={handleSaveGoogleMapsKey}
              disabled={!googleMapsKey || loading}
            >
              Salva
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
