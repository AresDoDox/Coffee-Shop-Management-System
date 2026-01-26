import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/store';
import { logout } from '../store/slices/auth/auth.actions';
import LanguageSwitcher from '../components/LanguageSwitcher';

const HomePage: React.FC = () => {
  const { t } = useTranslation(['home', 'product', 'common']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-8">
      <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">{t('common:welcome')}</h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => navigate('/admin/products')}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
          >
            {t('product:add_new')}
          </button>
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 font-bold text-white transition-colors hover:bg-red-600"
          >
            {t('home:logout')}
          </button>
        </div>
      </div>
      {user && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <p className="text-xl text-gray-700">
            {t('home:hello')}, <span className="font-semibold">{user.name}</span> ({user.email})
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
