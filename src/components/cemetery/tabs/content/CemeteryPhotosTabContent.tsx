
import React, { useState } from "react";
import { PhotoUploadDialog, PhotoUploadButton, PhotoGalleryCard } from "../../photos";

interface CemeteryPhotosTabContentProps {
  cemeteryId: string;
}

const CemeteryPhotosTabContent: React.FC<CemeteryPhotosTabContentProps> = ({ cemeteryId }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-medium">Foto del cimitero</h2>
      </div>
      
      <PhotoGalleryCard 
        cemeteryId={cemeteryId}
        refreshKey={refreshKey}
      />

      <PhotoUploadButton onClick={() => setUploadDialogOpen(true)} />

      <PhotoUploadDialog 
        cemeteryId={cemeteryId}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default CemeteryPhotosTabContent;
