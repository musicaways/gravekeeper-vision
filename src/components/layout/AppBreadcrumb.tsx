
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { HomeIcon, MapPin } from 'lucide-react';

interface BreadcrumbMap {
  [key: string]: {
    label: string;
    parent?: string;
    icon?: React.ReactNode;
  };
}

const breadcrumbMap: BreadcrumbMap = {
  '': { label: 'Home', icon: <HomeIcon className="h-3.5 w-3.5" /> },
  'cemeteries': { label: 'Cimiteri', parent: '' },
  'cemetery': { label: 'Dettaglio Cimitero', parent: 'cemeteries', icon: <MapPin className="h-3.5 w-3.5" /> },
  'profile': { label: 'Profilo Utente', parent: '' },
  'work-orders': { label: 'Ordini di Lavoro', parent: '' },
  'settings': { label: 'Impostazioni', parent: '' },
};

const AppBreadcrumb: React.FC = () => {
  const location = useLocation();
  
  // Skip breadcrumb for home page
  if (location.pathname === '/') {
    return null;
  }
  
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return null;
    
    const breadcrumbs = [];
    let currentPath = '';
    
    // Always add home
    breadcrumbs.push({
      path: '/',
      label: 'Home',
      icon: breadcrumbMap[''].icon,
      current: false
    });
    
    // Add other paths
    for (let i = 0; i < paths.length; i++) {
      const pathSegment = paths[i];
      const isLast = i === paths.length - 1;
      
      // Check if this is an ID segment (number)
      if (!isNaN(Number(pathSegment))) {
        continue; // Skip IDs in breadcrumb display
      }
      
      const mappedPath = breadcrumbMap[pathSegment];
      if (mappedPath) {
        const fullPath = `/${pathSegment}${i < paths.length - 1 && !isNaN(Number(paths[i+1])) ? `/${paths[i+1]}` : ''}`;
        
        breadcrumbs.push({
          path: fullPath,
          label: mappedPath.label,
          icon: mappedPath.icon,
          current: isLast
        });
      }
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <Breadcrumb className="border-b">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          return (
            <React.Fragment key={crumb.path}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="flex items-center">
                {crumb.current ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {crumb.icon}
                    <span>{crumb.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="flex items-center gap-1">
                    <Link to={crumb.path}>
                      {crumb.icon}
                      <span>{crumb.label}</span>
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
