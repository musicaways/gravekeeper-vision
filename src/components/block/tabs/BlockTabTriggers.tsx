
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Map, Grid, FileText, Image } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const BlockTabTriggers: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <ScrollArea className="w-full scrollbar-hide" orientation="horizontal">
        <TabsList className="w-full flex justify-start p-1">
          <TabsTrigger value="info" className="flex items-center gap-1.5 px-4 py-2">
            <Info className="h-4 w-4" />
            <span>Info</span>
          </TabsTrigger>
          <TabsTrigger value="loculi" className="flex items-center gap-1.5 px-4 py-2">
            <Grid className="h-4 w-4" />
            <span>Loculi</span>
          </TabsTrigger>
          <TabsTrigger value="documenti" className="flex items-center gap-1.5 px-4 py-2">
            <FileText className="h-4 w-4" />
            <span>Documenti</span>
          </TabsTrigger>
          <TabsTrigger value="foto" className="flex items-center gap-1.5 px-4 py-2">
            <Image className="h-4 w-4" />
            <span>Foto</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-1.5 px-4 py-2">
            <Map className="h-4 w-4" />
            <span>Mappa</span>
          </TabsTrigger>
        </TabsList>
      </ScrollArea>
    </div>
  );
};

export default BlockTabTriggers;
