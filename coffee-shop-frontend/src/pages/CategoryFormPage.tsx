
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, updateCategory, getCategories } from '../services/category.service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

interface CategoryForm {
  name: string;
}

const CategoryFormPage: React.FC = () => {
  const { t } = useTranslation(['product', 'common']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CategoryForm>();

  // Fetch category if in edit mode (using getAll for simplicity since we don't have getById yet, or we can filter)
  // Actually, let's just fetch all and find (or implement getById in service if strictly needed, but filtering is fine for small lists)
  // Fetch category
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 100 }), // Get all for finding
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && categoriesResponse?.data) {
      const category = categoriesResponse.data.find((c) => c.id === Number(id));
      if (category) {
        setValue('name', category.name);
      }
    }
  }, [isEditMode, categoriesResponse, id, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: CategoryForm) => {
      if (isEditMode) {
        return updateCategory(Number(id), data.name);
      } else {
        return createCategory(data.name);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      alert(t('common:success'));
      navigate('/admin/categories');
    },
    onError: (err) => {
      console.error(err);
      alert(t('common:error_occurred'));
    },
  });

  const onSubmit = (data: CategoryForm) => {
    mutation.mutate(data);
  };

  const loading = mutation.isPending;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-6">
      <div className="w-full max-w-lg rounded-lg bg-surface p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-textMain">
            {isEditMode ? t('common:edit') + ' ' + t('product:category') : t('common:add_new') + ' ' + t('product:category')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">
              {t('common:name')}
            </label>
            <input
              type="text"
              {...register('name', { required: t('common:required_field') || 'Required' })}
              className="w-full rounded border border-secondary p-2 focus:border-primary focus:outline-none"
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name.message as string}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90 disabled:bg-gray-300"
          >
            {loading ? t('common:loading') : t('common:submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormPage;
