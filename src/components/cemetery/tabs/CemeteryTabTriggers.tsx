
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, ListTodo, Map, Clock, Image, Building, Users, FileText, Phone } from "lucide-react";

const CemeteryTabTriggers: React.FC = () => {
  return (
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
        <FileText className="h-4 w-4" />
        <span>Amministrazione</span>
      </TabsTrigger>
      <TabsTrigger value="contact" className="flex items-center gap-1.5">
        <Phone className="h-4 w-4" />
        <span>Contatti</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default CemeteryTabTriggers;
