
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BlockGallery from "./BlockGallery";

interface PhotoGalleryCardProps {
  blockId: string;
  refreshKey: number;
}

const PhotoGalleryCard: React.FC<PhotoGalleryCardProps> = ({ blockId, refreshKey }) => {
  return (
    <Card className="shadow-md w-full">
      <CardContent className="px-4 py-2">
        <BlockGallery 
          blockId={blockId} 
          columns={3} 
          aspect="square" 
          className="mt-0"
          refreshKey={refreshKey}
        />
      </CardContent>
    </Card>
  );
};

export default PhotoGalleryCard;
