
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SecuritySettings() {
  return (
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
  );
}
