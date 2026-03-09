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
  Gift
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/store';
import { logout } from '../../store/slices/auth/auth.actions';

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
    { path: '/admin/categories', icon: <Package size={20} />, label: t('menu.categories') },
    { path: '/admin/vouchers', icon: <Gift size={20} />, label: 'Vouchers' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 flex flex-col bg-surface border-r border-secondary/30 shadow-2xl md:shadow-none transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
    ${isMobile ? (isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64') : (isOpen ? 'w-64' : 'w-20')}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Content */}
      <aside className={sidebarClasses}>
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-4 top-14 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-background text-textMuted border border-secondary/50 shadow-sm hover:text-accent hover:border-accent hover:shadow-md transition-all"
          >
            {isOpen ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
          </button>
        )}
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-secondary/30 px-4 group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-accent text-surface shadow-lg shadow-accent/20 transition-transform group-hover:scale-105">
              <Coffee size={22} className="stroke-[2.5]" />
            </div>
            <span
              className={`text-xl font-black tracking-tight text-textMain transition-all duration-300 whitespace-nowrap ${
                !isMobile && !isOpen ? 'w-0 opacity-0 translate-x-4 hidden' : 'w-auto opacity-100 translate-x-0'
              }`}
            >
              L-Coffee<span className="text-accent">.</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin">
          <div className={`mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-textMuted transition-opacity whitespace-nowrap ${!isMobile && !isOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>
            Overview
          </div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={isMobile ? onCloseMobile : undefined}
                className={`relative flex items-center gap-3.5 rounded-xl px-3 py-3 font-medium transition-all group overflow-hidden ${
                  isActive
                    ? 'text-surface bg-accent shadow-md shadow-accent/20'
                    : 'text-textMuted hover:bg-accent/10 hover:text-textMain hover:dark:text-surface'
                }`}
                title={!isOpen && !isMobile ? item.label : ''}
              >
                <div className={`min-w-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</div>
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    !isMobile && !isOpen ? 'w-0 opacity-0 -translate-x-2 hidden' : 'w-auto opacity-100 translate-x-0'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-secondary/30 p-4 shrink-0 transition-all">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-all group overflow-hidden ${
              !isMobile && !isOpen ? 'justify-center border border-red-500/20' : ''
            }`}
            title="Logout"
          >
            <div className="min-w-5 shrink-0 transition-transform group-hover:-translate-x-1">
              <LogOut size={20} />
            </div>
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                !isMobile && !isOpen ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
              }`}
            >
              {t('logout')}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
