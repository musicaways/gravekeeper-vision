
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
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-lg font-medium mb-4">Galleria fotografica</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Esplora la collezione di immagini di questo cimitero. Clicca su un'immagine per visualizzarla in formato più grande.
          </p>
          <CemeteryGallery 
            cemeteryId={cemeteryId} 
            columns={4} 
            aspect="wide" 
            className="mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CemeteryPhotosTabContent;
