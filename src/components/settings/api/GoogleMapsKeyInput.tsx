
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";

interface GoogleMapsKeyInputProps {
  googleMapsKey: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onTest: () => void;
  onToggleVisibility: () => void;
  maskedKey: string;
  showKey: boolean;
  hasExistingKey: boolean;
  loading: boolean;
  testLoading: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function GoogleMapsKeyInput({
  googleMapsKey,
  onChange,
  onSave,
  onTest,
  onToggleVisibility,
  maskedKey,
  showKey,
  hasExistingKey,
  loading,
  testLoading,
  onKeyDown
}: GoogleMapsKeyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label htmlFor="googlemaps" className="text-sm font-medium">
        Google Maps API Key
      </label>
      <div className="relative">
        <Input
          id="googlemaps"
          type={showKey ? "text" : "password"}
          placeholder={hasExistingKey ? maskedKey : "Inserisci la tua API key di Google Maps"}
          value={googleMapsKey}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="pr-24"
          ref={inputRef}
          disabled={loading || testLoading}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
          {hasExistingKey && (
            <Button 
              size="sm"
              variant="ghost"
              onClick={onToggleVisibility}
              disabled={loading || testLoading}
              className="h-8 w-8 p-0"
              aria-label={showKey ? "Nascondi API key" : "Mostra API key"}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showKey ? "Nascondi" : "Mostra"}</span>
            </Button>
          )}
          <Button 
            size="sm"
            variant="ghost"
            onClick={onTest}
            disabled={testLoading || loading}
            className="h-8 w-8 p-0"
            aria-label="Testa API key"
          >
            {testLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            <span className="sr-only">Testa</span>
          </Button>
          <Button 
            size="sm"
            variant="ghost"
            onClick={onSave}
            disabled={!googleMapsKey.trim() || loading || testLoading}
            className="h-8 w-8 p-0"
            aria-label="Salva API key"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="sr-only">Salva</span>
          </Button>
        </div>
      </div>
      {loading && <p className="text-xs text-muted-foreground">Salvando l'API key...</p>}
      {testLoading && <p className="text-xs text-muted-foreground">Testando l'API key...</p>}
      
      <p className="text-xs text-muted-foreground mt-2">
        Questa chiave API è necessaria per il funzionamento delle mappe nei dettagli del cimitero.
        Per ottenere una chiave API visita la <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Console Google Cloud</a>.
      </p>
    </div>
  );
}
