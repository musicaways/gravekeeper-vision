
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CemeterySectionsTab } from "./CemeterySectionsTab";
import { CemeteryDeceasedTab } from "./CemeteryDeceasedTab";
import { CemeteryMapTab } from "./CemeteryMapTab";

const CemeteryTabs = () => {
  return (
    <Tabs defaultValue="sections" className="mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sections">Settori</TabsTrigger>
        <TabsTrigger value="deceased">Defunti</TabsTrigger>
        <TabsTrigger value="map">Mappa</TabsTrigger>
      </TabsList>
      <TabsContent value="sections" className="mt-4">
        <CemeterySectionsTab />
      </TabsContent>
      <TabsContent value="deceased" className="mt-4">
        <CemeteryDeceasedTab />
      </TabsContent>
      <TabsContent value="map" className="mt-4">
        <CemeteryMapTab />
      </TabsContent>
    </Tabs>
  );
};

export default CemeteryTabs;
