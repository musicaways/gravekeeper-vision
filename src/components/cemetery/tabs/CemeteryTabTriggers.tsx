
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Map, Image, Building, FileText, Phone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CemeteryTabTriggers: React.FC = () => {
  return (
    <ScrollArea className="w-full mb-4">
      <TabsList className="inline-flex p-1 mb-1 w-auto min-w-full">
        <TabsTrigger value="info" className="flex items-center gap-1 px-3 py-1.5 text-xs">
          <Info className="h-3.5 w-3.5" />
          <span>Info</span>
        </TabsTrigger>
        <TabsTrigger value="sections" className="flex items-center gap-1 px-3 py-1.5 text-xs">
          <Building className="h-3.5 w-3.5" />
          <span>Settori</span>
        </TabsTrigger>
        <TabsTrigger value="map" className="flex items-center gap-1 px-3 py-1.5 text-xs">
          <Map className="h-3.5 w-3.5" />
          <span>Mappa</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-1 px-3 py-1.5 text-xs">
          <FileText className="h-3.5 w-3.5" />
          <span>Documenti</span>
        </TabsTrigger>
        <TabsTrigger value="gallery" className="flex items-center gap-1 px-3 py-1.5 text-xs">
          <Image className="h-3.5 w-3.5" />
          <span>Galleria</span>
        </TabsTrigger>
        <TabsTrigger value="administration" className="flex items-center gap-1 px-3 py-1.5 text-xs">
          <FileText className="h-3.5 w-3.5" />
          <span>Admin</span>
        </TabsTrigger>
        <TabsTrigger value="contact" className="flex items-center gap-1 px-3 py-1.5 text-xs">
          <Phone className="h-3.5 w-3.5" />
          <span>Contatti</span>
        </TabsTrigger>
      </TabsList>
    </ScrollArea>
  );
};

export default CemeteryTabTriggers;
