
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CemeteryInfoCard from "./CemeteryInfoCard";
import { CemeterySectionsTab } from "./CemeterySectionsTab";
import { CemeteryDeceasedTab } from "./CemeteryDeceasedTab";
import CemeteryHours from "./CemeteryHours";
import { CemeteryMapTab } from "./CemeteryMapTab";
import CemeteryGallery from "./CemeteryGallery";
import CemeteryAdministration from "./CemeteryAdministration";
import { CemeteryNicheMap } from "./CemeteryNicheMap";
import { Info, ListTodo, Map, Clock, Image, Building, Users } from "lucide-react";

interface CemeteryTabsProps {
  cemetery: any;
  cemeteryId: string;
}

export const CemeteryTabs = ({ cemetery, cemeteryId }: CemeteryTabsProps) => {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="mb-6 flex flex-wrap gap-1">
        <TabsTrigger value="info" className="flex items-center gap-1.5">
          <Info className="h-4 w-4" />
          <span>Informazioni</span>
        </TabsTrigger>
        <TabsTrigger value="sections" className="flex items-center gap-1.5">
          <Building className="h-4 w-4" />
          <span>Settori e Blocchi</span>
        </TabsTrigger>
        <TabsTrigger value="niches" className="flex items-center gap-1.5">
          <ListTodo className="h-4 w-4" />
          <span>Mappa Nicchie</span>
        </TabsTrigger>
        <TabsTrigger value="map" className="flex items-center gap-1.5">
          <Map className="h-4 w-4" />
          <span>Mappa</span>
        </TabsTrigger>
        <TabsTrigger value="deceased" className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>Defunti</span>
        </TabsTrigger>
        <TabsTrigger value="hours" className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>Orari</span>
        </TabsTrigger>
        <TabsTrigger value="gallery" className="flex items-center gap-1.5">
          <Image className="h-4 w-4" />
          <span>Galleria</span>
        </TabsTrigger>
        <TabsTrigger value="administration" className="flex items-center gap-1.5">
          <Building className="h-4 w-4" />
          <span>Amministrazione</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-6">
        <CemeteryInfoCard cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="sections" className="space-y-6">
        <CemeterySectionsTab cemeteryId={cemeteryId} />
      </TabsContent>
      
      <TabsContent value="niches" className="space-y-6">
        <CemeteryNicheMap />
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
    </Tabs>
  );
};
