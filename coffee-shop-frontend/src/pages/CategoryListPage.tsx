import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, deleteCategory } from '../services/category.service';
import type { Category } from '../services/category.service';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/common/Pagination';
import useDebounce from '../hooks/useDebounce';

const CategoryListPage: React.FC = () => {
  const { t } = useTranslation(['common', 'product']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const debouncedSearch = useDebounce(search, 500);
  const limit = 10;

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories', page, debouncedSearch],
    queryFn: () => getCategories({ page, limit, search: debouncedSearch }),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });

  const categories = data?.data;
  const meta = data?.meta;

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => {
      alert(t('common:error_occurred'));
      console.error(err);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm(t('common:confirm_delete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading categories</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-textMain text-2xl font-bold">{t('product:category')}</h1>
        <Link
          to="/admin/categories/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
        >
          {t('common:add_new')}
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={handleSearchChange}
          className="w-full rounded border border-gray-300 p-2 sm:max-w-xs"
        />
      </div>

      <div className="bg-surface overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-secondary/20 text-textMain border-secondary border-b">
              <th className="p-4">{t('common:id') || 'ID'}</th>
              <th className="p-4">{t('common:name')}</th>
              <th className="p-4">{t('common:actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category: Category) => (
              <tr key={category.id} className="border-secondary hover:bg-secondary/10 border-b">
                <td className="text-textMain p-4">{category.id}</td>
                <td className="text-textMain p-4 font-medium">{category.name}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/categories/${category.id}/edit`}
                      className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      {t('common:edit')}
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    >
                      {t('common:delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories?.length === 0 && (
          <div className="p-6 text-center text-gray-500">{t('common:no_data')}</div>
        )}
      </div>
      
      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default CategoryListPage;
