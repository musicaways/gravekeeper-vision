
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield } from "lucide-react";
import { GeneralSettings } from "./GeneralSettings";
import { NotificationSettings } from "./NotificationSettings";
import { SecuritySettings } from "./SecuritySettings";

interface SettingsTabsProps {
  language: string;
  setLanguage: (value: string) => void;
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
}

export function SettingsTabs({
  language,
  setLanguage,
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications
}: SettingsTabsProps) {
  return (
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
        <GeneralSettings 
          language={language}
          setLanguage={setLanguage}
        />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <NotificationSettings 
          emailNotifications={emailNotifications}
          setEmailNotifications={setEmailNotifications}
          pushNotifications={pushNotifications}
          setPushNotifications={setPushNotifications}
        />
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  );
}
