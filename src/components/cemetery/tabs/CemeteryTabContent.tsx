
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
  searchTerm?: string; // Added searchTerm as an optional prop
}

const CemeteryTabContent: React.FC<CemeteryTabContentProps> = ({ cemetery, cemeteryId, searchTerm = "" }) => {
  return (
    <>
      <TabsContent value="info" className="space-y-6 w-full">
        <CemeteryInfoCard cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="sections" className="space-y-6 w-full">
        <CemeterySectionsTab cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="map" className="space-y-6 w-full">
        <CemeteryMapTab />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6 w-full">
        <CemeteryDocuments cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="gallery" className="space-y-6 w-full">
        <CemeteryGallery cemeteryId={cemeteryId} />
      </TabsContent>
    </>
  );
};

export default CemeteryTabContent;
