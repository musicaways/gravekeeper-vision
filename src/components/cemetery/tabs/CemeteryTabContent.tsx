
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  CemeteryInfoTabContent,
  CemeterySectionsTabContent,
  CemeteryDocumentsTabContent,
  CemeteryPhotosTabContent
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
      <TabsContent value="info" className="w-full max-w-none">
        <CemeteryInfoTabContent cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="sections" className="w-full max-w-none">
        <CemeterySectionsTabContent cemeteryId={cemeteryId} searchTerm={searchTerm} />
      </TabsContent>

      <TabsContent value="photos" className="w-full max-w-none">
        <CemeteryPhotosTabContent cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="documents" className="w-full max-w-none">
        <CemeteryDocumentsTabContent cemeteryId={cemeteryId} />
      </TabsContent>
    </>
  );
};

export default CemeteryTabContent;
