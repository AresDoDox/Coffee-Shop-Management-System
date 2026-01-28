import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/store';

const HomePage: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-background flex min-h-full flex-col p-8">
      {user && (
        <div className="bg-surface rounded-lg p-8 text-center shadow-sm">
          <h1 className="text-primary mb-4 text-4xl font-bold">{t('common:welcome')}</h1>
          <p className="text-textMain text-xl">
            {t('home:hello')}, <span className="font-semibold">{user.name}</span>
          </p>
          <p className="text-textMuted mt-2">{user.email}</p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate('/pos')}
              className="bg-primary rounded-lg px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Open POS
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="border-primary text-primary hover:bg-primary/10 rounded-lg border-2 px-6 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
