
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  CemeteryInfoTabContent,
  CemeterySectionsTabContent,
  CemeteryDocumentsTabContent
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
      <TabsContent value="info" className="space-y-6 w-full px-2">
        <CemeteryInfoTabContent cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="sections" className="space-y-6 w-full px-2">
        <CemeterySectionsTabContent cemeteryId={cemeteryId} searchTerm={searchTerm} />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6 w-full px-2">
        <CemeteryDocumentsTabContent cemeteryId={cemeteryId} />
      </TabsContent>
    </>
  );
};

export default CemeteryTabContent;
