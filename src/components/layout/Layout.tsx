
import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout = ({ children, title = "CemeteryPro", subtitle }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
    
    // Check if we're in mobile view
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobileView();
    
    // Add resize listener
    window.addEventListener('resize', checkMobileView);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);
  
  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Only one sidebar that's fixed on all screen sizes but can be toggled */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleToggleSidebar} 
        className={`absolute md:relative z-30 h-full ${sidebarCollapsed ? 'translate-x-[-100%] md:translate-x-0' : ''}`}
      />
      
      {/* Main content that adjusts based on sidebar state */}
      <div className={`flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ${!sidebarCollapsed ? 'md:ml-[240px]' : 'md:ml-[70px]'}`}>
        <Topbar title={title} subtitle={subtitle} />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
