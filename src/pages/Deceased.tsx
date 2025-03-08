
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import DeceasedList from "@/components/deceased/DeceasedList";
import ExternalSearchFrame from "@/components/deceased/ExternalSearchFrame";

const Deceased = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Registro Defunti</h1>
        <p className="text-muted-foreground">
          Consulta i defunti registrati e ricerca informazioni specifiche
        </p>
      </div>

      <Card className="p-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex justify-start p-1">
            <TabsTrigger value="list" className="flex items-center gap-1.5 px-4 py-2">
              <Users className="h-4 w-4" />
              <span>Defunti</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-1.5 px-4 py-2">
              <Search className="h-4 w-4" />
              <span>Ricerca Defunto</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0 p-4">
            <DeceasedList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </TabsContent>
          
          <TabsContent value="search" className="mt-0 p-4">
            <ExternalSearchFrame />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Deceased;
