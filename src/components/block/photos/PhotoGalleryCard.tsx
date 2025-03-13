
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
      <CardContent className="p-2 sm:p-3">
        <BlockGallery 
          blockId={blockId} 
          columns={4} 
          aspect="square" 
          className="mt-0"
          refreshKey={refreshKey}
        />
      </CardContent>
    </Card>
  );
};

export default PhotoGalleryCard;
