
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Globe, Moon, Sun } from "lucide-react";

interface GeneralSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function GeneralSettings({ 
  language, 
  setLanguage, 
  darkMode, 
  setDarkMode 
}: GeneralSettingsProps) {
  const { toast } = useToast();

  const handleSaveGeneralSettings = () => {
    toast({
      title: "Impostazioni salvate",
      description: "Le tue impostazioni generali sono state aggiornate con successo.",
    });
  };

  const handleResetSettings = () => {
    toast({
      variant: "destructive",
      title: "Impostazioni resettate",
      description: "Tutte le impostazioni sono state riportate ai valori predefiniti.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impostazioni Generali</CardTitle>
        <CardDescription>
          Gestisci le tue preferenze generali per l'applicazione.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Lingua</Label>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select 
                id="language"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="it">Italiano</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {darkMode ? 
                  <Moon className="h-4 w-4 text-muted-foreground" /> : 
                  <Sun className="h-4 w-4 text-muted-foreground" />
                }
                <Label htmlFor="dark-mode">Modalità scura</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Attiva la modalità scura per un'esperienza visiva più confortevole in ambienti con poca luce.
              </p>
            </div>
            <Switch 
              id="dark-mode" 
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleResetSettings}>Ripristina</Button>
        <Button onClick={handleSaveGeneralSettings}>Salva modifiche</Button>
      </CardFooter>
    </Card>
  );
}
