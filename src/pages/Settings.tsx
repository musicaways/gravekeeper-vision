
import { useState } from "react";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export default function Settings() {
  const [language, setLanguage] = useState("it");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div className="container mx-auto p-4">
      <SettingsHeader />
      <SettingsTabs 
        language={language}
        setLanguage={setLanguage}
        emailNotifications={emailNotifications}
        setEmailNotifications={setEmailNotifications}
        pushNotifications={pushNotifications}
        setPushNotifications={setPushNotifications}
      />
    </div>
  );
}
