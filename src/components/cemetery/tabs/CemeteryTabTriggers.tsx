
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Map, Image, Building, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CemeteryTabTriggers: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <ScrollArea className="w-full scrollbar-hide" orientation="horizontal">
        <TabsList className="w-full flex justify-start p-1">
          <TabsTrigger value="info" className="flex items-center gap-1.5 px-4 py-2">
            <Info className="h-4 w-4" />
            <span>Info</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-1.5 px-4 py-2">
            <Building className="h-4 w-4" />
            <span>Settori</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-1.5 px-4 py-2">
            <Map className="h-4 w-4" />
            <span>Mappa</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1.5 px-4 py-2">
            <FileText className="h-4 w-4" />
            <span>Documenti</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-1.5 px-4 py-2">
            <Image className="h-4 w-4" />
            <span>Galleria</span>
          </TabsTrigger>
        </TabsList>
      </ScrollArea>
    </div>
  );
};

export default CemeteryTabTriggers;
