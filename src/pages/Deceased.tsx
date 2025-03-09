
import { useState } from "react";
import { Users } from "lucide-react";
import DeceasedList from "@/components/deceased/DeceasedList";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";

const Deceased = () => {
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
      
      <div className="w-full max-w-none p-4">
        <div className="w-full flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Registro Defunti
          </h1>
        </div>
        
        <DeceasedList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </div>
  );
};

export default Deceased;
