
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  CemeteryInfoTabContent,
  CemeterySectionsTabContent,
  CemeteryMapTabContent,
  CemeteryDocumentsTabContent,
  CemeteryGalleryTabContent
} from "./content";

interface CemeteryTabContentProps {
  cemetery: any;
  cemeteryId: string;
  searchTerm?: string;
}

const CemeteryTabContent: React.FC<CemeteryTabContentProps> = ({ 
  cemetery, 
  cemeteryId, 
  searchTerm = "" 
}) => {
  return (
    <>
      <TabsContent value="info" className="space-y-6 w-full">
        <CemeteryInfoTabContent cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="sections" className="space-y-6 w-full">
        <CemeterySectionsTabContent cemeteryId={cemeteryId} searchTerm={searchTerm} />
      </TabsContent>

      <TabsContent value="map" className="space-y-6 w-full">
        <CemeteryMapTabContent />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6 w-full">
        <CemeteryDocumentsTabContent cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="gallery" className="space-y-6 w-full">
        <CemeteryGalleryTabContent cemeteryId={cemeteryId} />
      </TabsContent>
    </>
  );
};

export default CemeteryTabContent;
