
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";
import DeceasedList from "@/components/deceased/DeceasedList";

const Deceased = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || "";

  // Listen for search term changes in the URL
  useEffect(() => {
    // This is handled by the global search in Topbar.tsx
    // We just need to read the search parameter
  }, [location.search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-none pl-0"> {/* Changed from pl-1 to pl-0 */}
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
              <span>Defunti</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="w-full max-w-none px-1 pb-8">
        <DeceasedList searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default Deceased;
