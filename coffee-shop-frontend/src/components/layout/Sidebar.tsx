import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Coffee,
  LayoutDashboard,
  ShoppingBag,
  ChefHat,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/store';
import { logout } from '../../store/slices/auth/auth.actions';
import LanguageSwitcher from '../LanguageSwitcher';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isMobile, onCloseMobile }) => {
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: <Coffee size={20} />, label: t('menu.home') },
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: t('menu.dashboard') },
    { path: '/pos', icon: <ShoppingBag size={20} />, label: t('menu.pos') },
    { path: '/kitchen', icon: <ChefHat size={20} />, label: t('menu.kitchen') },
    { path: '/admin/products', icon: <Package size={20} />, label: t('menu.products') },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 flex flex-col bg-surface shadow-lg transition-all duration-300 ease-in-out
    ${isMobile ? (isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64') : (isOpen ? 'w-64' : 'w-20')}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Content */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-secondary px-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Coffee size={18} />
            </div>
            <span
              className={`text-xl font-bold text-primary transition-opacity duration-200 ${
                !isMobile && !isOpen ? 'opacity-0 hidden' : 'opacity-100'
              }`}
            >
              L-Coffee
            </span>
          </div>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="hidden rounded-full bg-background p-1 text-textMuted hover:text-primary md:block"
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4 scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={isMobile ? onCloseMobile : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-textMuted hover:bg-background hover:text-textMain'
                }`}
                title={!isOpen && !isMobile ? item.label : ''}
              >
                <div className="min-w-[1.25rem]">{item.icon}</div>
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                    !isMobile && !isOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-secondary p-4">
          <div className={`flex flex-col gap-4 ${!isMobile && !isOpen ? 'items-center' : ''}`}>
            {/* Language Switcher - Hide text if collapsed */}
            <div className={`${!isMobile && !isOpen ? 'scale-75' : ''}`}>
               <LanguageSwitcher />
            </div>
            
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 hover:bg-red-50 ${
                !isMobile && !isOpen ? 'justify-center' : ''
              }`}
              title="Logout"
            >
              <LogOut size={20} />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                  !isMobile && !isOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                {t('logout')}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
