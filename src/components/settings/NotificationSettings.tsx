
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
}

export function NotificationSettings({
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications
}: NotificationSettingsProps) {
  const { toast } = useToast();

  const handleSaveNotificationSettings = () => {
    toast({
      title: "Preferenze notifiche aggiornate",
      description: "Le tue preferenze di notifica sono state aggiornate con successo.",
    });
  };

  return (
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
  );
}
