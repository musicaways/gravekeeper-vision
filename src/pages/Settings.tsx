
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Shield, Settings as SettingsIcon, Globe, Moon, Sun } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [language, setLanguage] = useState("it");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSaveGeneralSettings = () => {
    toast({
      title: "Impostazioni salvate",
      description: "Le tue impostazioni generali sono state aggiornate con successo.",
    });
  };

  const handleSaveNotificationSettings = () => {
    toast({
      title: "Preferenze notifiche aggiornate",
      description: "Le tue preferenze di notifica sono state aggiornate con successo.",
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
    <Layout title="Impostazioni">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold">Impostazioni</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Badge variant="outline" className="flex items-center gap-1">
              <SettingsIcon className="h-3 w-3" />
              Configurazione
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full md:w-1/2">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Generali</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifiche</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sicurezza</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferenze Notifiche</CardTitle>
                <CardDescription>
                  Gestisci come e quando desideri ricevere le notifiche.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="email-notifications">Notifiche email</Label>
                    <p className="text-sm text-muted-foreground">
                      Ricevi notifiche via email per eventi importanti e aggiornamenti.
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="push-notifications">Notifiche push</Label>
                    <p className="text-sm text-muted-foreground">
                      Ricevi notifiche push nel browser per aggiornamenti in tempo reale.
                    </p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotificationSettings} className="ml-auto">Salva preferenze</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sicurezza</CardTitle>
                <CardDescription>
                  Gestisci le tue credenziali di accesso e le impostazioni di sicurezza.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Password attuale</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nuova password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Conferma password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Aggiorna password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
