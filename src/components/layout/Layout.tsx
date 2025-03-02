
import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout = ({ children, title = "CemeteryPro", subtitle }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

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
      {/* Single sidebar for both mobile and desktop */}
      <Sidebar 
        open={sidebarOpen} 
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Topbar 
          title={title} 
          subtitle={subtitle} 
          onMenuClick={isMobile ? toggleSidebar : undefined} 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
