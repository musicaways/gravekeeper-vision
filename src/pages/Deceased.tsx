
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search } from "lucide-react";
import DeceasedList from "@/components/deceased/DeceasedList";
import ExternalSearchFrame from "@/components/deceased/ExternalSearchFrame";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";

const Deceased = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <HomeIcon className="h-3.5 w-3.5" />
              <span>Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Registro Defunti</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="w-full max-w-none">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky z-10 bg-background/95 backdrop-blur-sm pb-1 pt-2 w-full">
            <TabsList className="h-10 px-2 w-full justify-start border-b rounded-none bg-transparent">
              <TabsTrigger
                value="list"
                className="rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent"
              >
                <Users className="h-4 w-4 mr-2" />
                Defunti
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent"
              >
                <Search className="h-4 w-4 mr-2" />
                Ricerca Defunto
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="w-full max-w-none">
            <TabsContent value="list" className="mt-0">
              <DeceasedList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </TabsContent>
            
            <TabsContent value="search" className="mt-0">
              <ExternalSearchFrame />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Deceased;
