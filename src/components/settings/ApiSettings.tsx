
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";
import { useApiKeyManagement } from "./hooks/useApiKeyManagement";
import { GoogleMapsKeyInput } from "./api/GoogleMapsKeyInput";

export function ApiSettings() {
  const {
    googleMapsKey,
    setGoogleMapsKey,
    maskedKey,
    showKey,
    loading,
    testLoading,
    hasExistingKey,
    handleSaveGoogleMapsKey,
    testGoogleMapsApi,
    toggleKeyVisibility
  } = useApiKeyManagement();

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
        <GoogleMapsKeyInput
          googleMapsKey={googleMapsKey}
          onChange={setGoogleMapsKey}
          onSave={handleSaveGoogleMapsKey}
          onTest={testGoogleMapsApi}
          onToggleVisibility={toggleKeyVisibility}
          maskedKey={maskedKey}
          showKey={showKey}
          hasExistingKey={hasExistingKey}
          loading={loading}
          testLoading={testLoading}
          onKeyDown={handleKeyDown}
        />
      </CardContent>
    </Card>
  );
}
