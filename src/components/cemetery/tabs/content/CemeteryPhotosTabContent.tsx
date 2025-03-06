
import React from "react";
import CemeteryGallery from "../../CemeteryGallery";
import { Card, CardContent } from "@/components/ui/card";

interface CemeteryPhotosTabContentProps {
  cemeteryId: string;
}

const CemeteryPhotosTabContent: React.FC<CemeteryPhotosTabContentProps> = ({ cemeteryId }) => {
  return (
    <div className="w-full space-y-4">
      <Card>
        <CardContent className="p-2 sm:p-3">
          <CemeteryGallery 
            cemeteryId={cemeteryId} 
            columns={4} 
            aspect="square" 
            className="mt-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CemeteryPhotosTabContent;
