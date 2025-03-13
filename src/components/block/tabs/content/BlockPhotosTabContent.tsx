
import React, { useState } from "react";
import { PhotoUploadDialog } from "../../photos/PhotoUploadDialog";
import { PhotoUploadButton } from "../../photos/PhotoUploadButton";
import { PhotoGalleryCard } from "../../photos/PhotoGalleryCard";

interface BlockPhotosTabContentProps {
  blockId: string;
}

const BlockPhotosTabContent: React.FC<BlockPhotosTabContentProps> = ({ blockId }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="px-1 w-full space-y-4">
      <PhotoGalleryCard 
        blockId={blockId}
        refreshKey={refreshKey}
      />

      <PhotoUploadButton onClick={() => setUploadDialogOpen(true)} />

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
