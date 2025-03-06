
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CemeteryGallery from "../CemeteryGallery";

interface PhotoGalleryCardProps {
  cemeteryId: string;
  refreshKey: number;
}

const PhotoGalleryCard: React.FC<PhotoGalleryCardProps> = ({ cemeteryId, refreshKey }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Galleria fotografica</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        <CemeteryGallery 
          cemeteryId={cemeteryId} 
          columns={4} 
          aspect="square" 
          className="mt-0"
          key={refreshKey}
        />
      </CardContent>
    </Card>
  );
};

export default PhotoGalleryCard;
