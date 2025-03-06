
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Key, CheckCircle2, Save } from "lucide-react";

export function ApiSettings() {
  const [googleMapsKey, setGoogleMapsKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSaveGoogleMapsKey = async () => {
    if (!googleMapsKey.trim()) return;
    
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
      // Focus the input field again after success
      if (inputRef.current) inputRef.current.focus();
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Errore nel salvare l'API key");
    } finally {
      setLoading(false);
    }
  };

  const testGoogleMapsApi = async () => {
    try {
      setTestLoading(true);
      
      // First get the API key from the database
      const { data, error } = await supabase
        .from('api_keys')
        .select('googlemaps_key')
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data?.googlemaps_key) {
        toast.error("Nessuna API key di Google Maps trovata");
        return;
      }
      
      // Test the Google Maps API with a simple geocoding request
      const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Roma,Italia&key=${data.googlemaps_key}`;
      const response = await fetch(testUrl);
      const result = await response.json();
      
      console.log("Google Maps API test result:", result);
      
      if (result.status === "OK") {
        toast.success("Test dell'API di Google Maps completato con successo");
      } else if (result.error_message) {
        toast.error(`Errore nel test dell'API: ${result.error_message}`);
      } else {
        toast.error(`Errore nel test dell'API: ${result.status}`);
      }
    } catch (error) {
      console.error("Error testing API key:", error);
      toast.error("Errore durante il test dell'API key");
    } finally {
      setTestLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && googleMapsKey.trim()) {
      handleSaveGoogleMapsKey();
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
          <div className="relative">
            <Input
              id="googlemaps"
              type="password"
              placeholder="Inserisci la tua API key di Google Maps"
              value={googleMapsKey}
              onChange={(e) => setGoogleMapsKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-12"
              ref={inputRef}
              disabled={loading}
            />
            <Button 
              size="sm"
              variant="ghost"
              onClick={handleSaveGoogleMapsKey}
              disabled={!googleMapsKey.trim() || loading}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              aria-label="Salva API key"
            >
              <Save className="h-4 w-4" />
              <span className="sr-only">Salva</span>
            </Button>
          </div>
          {loading && (
            <p className="text-xs text-muted-foreground">Salvando l'API key...</p>
          )}
          
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={testGoogleMapsApi}
              disabled={testLoading}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {testLoading ? "Testando..." : "Testa API Google Maps"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Questo test verificherà il funzionamento della chiave API facendo una richiesta di geocodifica.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
