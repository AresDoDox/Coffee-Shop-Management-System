import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle Window Resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false); // Close on mobile by default
      } else {
        setIsSidebarOpen(true); // Open on desktop by default
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeMobileSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background text-textMain">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        onCloseMobile={closeMobileSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          !isMobile && isSidebarOpen ? 'md:ml-64' : !isMobile ? 'md:ml-20' : 'ml-0'
        }`}
      >
        {/* Mobile Header (Hamburger) */}
        {isMobile && (
          <header className="flex h-16 items-center justify-between bg-surface px-4 shadow-sm">
            <button onClick={toggleSidebar} className="text-textMain hover:text-primary">
              <Menu size={24} />
            </button>
            <span className="text-lg font-bold text-primary">L-Coffee</span>
            <div className="w-6" /> {/* Spacer */}
          </header>
        )}

        {/* Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
