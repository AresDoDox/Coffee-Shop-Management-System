import React from 'react';
import { Menu } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../common/ThemeToggle';
import { useAppSelector } from '../../store/store';

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isMobile }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-secondary/50 bg-surface/80 px-4 shadow-sm backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-textMain hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
        )}
        
        {/* Brand Name (Only visible on Mobile when Sidebar is hidden, or up to design preference) */}
        {isMobile && (
          <span className="text-xl font-black tracking-tight text-primary">
            L-Coffee.
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        
        {/* User Profile Info snippet */}
        {!isMobile && user && (
          <div className="ml-4 flex items-center gap-3 border-l border-secondary/50 pl-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-textMain leading-none">{user.name}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
