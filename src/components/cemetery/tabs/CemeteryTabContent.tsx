
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import CemeteryInfoCard from "../CemeteryInfoCard";
import { CemeterySectionsTab } from "../CemeterySectionsTab";
import { CemeteryMapTab } from "../CemeteryMapTab";
import CemeteryDocuments from "../CemeteryDocuments";
import CemeteryGallery from "../CemeteryGallery";

interface CemeteryTabContentProps {
  cemetery: any;
  cemeteryId: string;
}

const CemeteryTabContent: React.FC<CemeteryTabContentProps> = ({ cemetery, cemeteryId }) => {
  return (
    <>
      <TabsContent value="info" className="space-y-6">
        <CemeteryInfoCard cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="sections" className="space-y-6">
        <CemeterySectionsTab cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="map" className="space-y-6">
        <CemeteryMapTab />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6">
        <CemeteryDocuments cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="gallery" className="space-y-6">
        <CemeteryGallery cemeteryId={cemeteryId} />
      </TabsContent>
    </>
  );
};

export default CemeteryTabContent;
