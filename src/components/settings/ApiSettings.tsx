
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";
import { useApiKeyManagement } from "./hooks/useApiKeyManagement";
import { GoogleMapsKeyInput } from "./api/GoogleMapsKeyInput";
import { Toaster } from "sonner";

export function ApiSettings() {
  const {
    googleMapsKey,
    setGoogleMapsKey,
    maskedKey,
    showKey,
    loading,
    testLoading,
    hasExistingKey,
    testSuccess,
    handleSaveGoogleMapsKey,
    testGoogleMapsApi,
    toggleKeyVisibility
  } = useApiKeyManagement();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && googleMapsKey.trim()) {
      console.log("Enter key pressed, saving API key...");
      handleSaveGoogleMapsKey();
    }
  };

  // Log component state for debugging
  useEffect(() => {
    console.log("ApiSettings rendering - hasExistingKey:", hasExistingKey, 
                "loading:", loading, 
                "testLoading:", testLoading, 
                "testSuccess:", testSuccess);
  }, [hasExistingKey, loading, testLoading, testSuccess]);

  return (
    <>
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
            testSuccess={testSuccess}
            onKeyDown={handleKeyDown}
          />
        </CardContent>
      </Card>
      <Toaster position="top-right" />
    </>
  );
}
