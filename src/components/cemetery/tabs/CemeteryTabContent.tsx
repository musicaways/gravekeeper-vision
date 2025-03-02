
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import CemeteryInfoCard from "../CemeteryInfoCard";
import { CemeterySectionsTab } from "../CemeterySectionsTab";
import { CemeteryNicheMap } from "../CemeteryNicheMap";
import { CemeteryMapTab } from "../CemeteryMapTab";
import { CemeteryDeceasedTab } from "../CemeteryDeceasedTab";
import CemeteryHours from "../CemeteryHours";
import CemeteryGallery from "../CemeteryGallery";
import CemeteryAdministration from "../CemeteryAdministration";
import ContactTab from "../contact/ContactTab";

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
      
      <TabsContent value="niches" className="space-y-6">
        <CemeteryNicheMap cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="map" className="space-y-6">
        <CemeteryMapTab />
      </TabsContent>

      <TabsContent value="deceased" className="space-y-6">
        <CemeteryDeceasedTab cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="hours" className="space-y-6">
        <CemeteryHours cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="gallery" className="space-y-6">
        <CemeteryGallery cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="administration" className="space-y-6">
        <CemeteryAdministration cemeteryId={cemeteryId} />
      </TabsContent>
      
      <TabsContent value="contact" className="space-y-6">
        <ContactTab cemetery={cemetery} />
      </TabsContent>
    </>
  );
};

export default CemeteryTabContent;
