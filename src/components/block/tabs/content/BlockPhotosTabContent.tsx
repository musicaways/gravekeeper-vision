
import React, { useState, useEffect } from "react";
import PhotoUploadDialog from "../../photos/PhotoUploadDialog";
import PhotoUploadButton from "../../photos/PhotoUploadButton";
import PhotoGalleryCard from "../../photos/PhotoGalleryCard";
import { setupPhotoDatabaseResources } from "../../photos/utils/databaseSetup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BlockPhotosTabContentProps {
  blockId: string;
}

const BlockPhotosTabContent: React.FC<BlockPhotosTabContentProps> = ({ blockId }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(true);

  useEffect(() => {
    const initializeResources = async () => {
      try {
        setIsSettingUp(true);
        await setupPhotoDatabaseResources();
        setIsReady(true);
        setSetupError(null);
      } catch (error) {
        console.error("Error initializing photo resources:", error);
        setSetupError("Si è verificato un errore durante l'inizializzazione della galleria. Riprova più tardi.");
      } finally {
        setIsSettingUp(false);
      }
    };

    initializeResources();
  }, []);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="px-1 w-full space-y-4">
      {setupError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{setupError}</AlertDescription>
        </Alert>
      )}
      
      <div className="w-full max-w-screen-lg mx-auto">
        <PhotoGalleryCard 
          blockId={blockId}
          refreshKey={refreshKey}
        />
      </div>

      <PhotoUploadButton 
        onClick={() => setUploadDialogOpen(true)} 
        disabled={isSettingUp || !!setupError}
      />

      <PhotoUploadDialog 
        blockId={blockId}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default BlockPhotosTabContent;
