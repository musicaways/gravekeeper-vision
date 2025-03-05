
import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AppBreadcrumb from './AppBreadcrumb';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout = ({ children, title = "CemeteryPro", subtitle }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();
  
  // Determine if we should show back button
  const showBackButton = location.pathname.includes('/cemetery/') || location.pathname.includes('/block/');

  useEffect(() => {
    // Check if we're on mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initialize
    checkIsMobile();
    
    // Set initial sidebar state based on device and stored preference
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(window.innerWidth >= 768 ? savedState === 'true' : false);
    } else {
      setSidebarOpen(window.innerWidth >= 768);
    }
    
    // Update on resize
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    if (!isMobile) {
      localStorage.setItem('sidebarOpen', String(newState));
    }
  };

  return (
    <div className={`flex h-screen bg-background overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Topbar 
          onMenuClick={toggleSidebar}
          showBackButton={showBackButton} 
        />
        <main className="flex-1 overflow-auto">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
