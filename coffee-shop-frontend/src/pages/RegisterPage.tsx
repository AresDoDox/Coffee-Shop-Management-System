import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../store/store';
import { registerUser, clearError } from '../store/slices/auth/auth.actions';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { createRegisterSchema } from '../validations/auth.schema';
import type { RegisterSchema } from '../validations/auth.schema';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'validation', 'errors']);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(createRegisterSchema(t)),
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: RegisterSchema) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-4 flex w-full max-w-md justify-end">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('auth:register.title')}</h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {t(error || 'errors:default')}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('auth:register.name')}
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name.message as string}</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('auth:register.email')}
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message as string}</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('auth:register.password')}
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message as string}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? t('auth:register.loading') : t('auth:register.submit')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t('register.login_prompt')}{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            {t('register.login_link')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
