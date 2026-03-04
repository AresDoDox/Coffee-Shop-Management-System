import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../store/store';
import { loginUser, clearError } from '../store/slices/auth/auth.actions';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { createLoginSchema } from '../validations/auth.schema';
import type { LoginSchema } from '../validations/auth.schema';

const LoginPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'validation', 'errors']);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(createLoginSchema(t)),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = (data: LoginSchema) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-4 flex w-full max-w-md justify-end">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-lg bg-surface p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-textMain">{t('auth:login.title')}</h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {t(error || 'errors:default')}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">
              {t('auth:login.email')}
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded border border-secondary p-2 focus:border-primary focus:outline-none"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message as string}</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">
              {t('auth:login.password')}
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded border border-secondary p-2 focus:border-primary focus:outline-none"
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message as string}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90 disabled:bg-gray-300"
          >
            {loading ? t('login.loading') : t('login.submit')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-textMuted">
          {t('login.register_prompt')}{' '}
          <Link to="/register" className="text-primary hover:underline">
            {t('login.register_link')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
