import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '../services/product.service';
import { getCategories } from '../services/category.service';
import type { Product } from '../services/product.service';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/common/Pagination';
import useDebounce from '../hooks/useDebounce';

const ProductListPage: React.FC = () => {
  const { t } = useTranslation(['common', 'product']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  
  const debouncedSearch = useDebounce(search, 500); // 500ms debounce delay
  const limit = 10;

  // Fetch Categories for Filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-filter'],
    queryFn: () => getCategories({ page: 1, limit: 100 }), // Fetch enough categories for dropdown
  });
  const categories = categoriesData?.data || [];

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, debouncedSearch, categoryId],
    queryFn: () => getProducts({ page, limit, search: debouncedSearch, categoryId }),
    placeholderData: (previousData) => previousData,
  });

  const products = data?.data;
  const meta = data?.meta;

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => {
        alert(t('common:error_occurred'));
        console.error(err);
    }
  });

  const handleDelete = (id: number) => {
    if (confirm(t('common:confirm_delete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryId(value ? Number(value) : undefined);
    setPage(1);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading products</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-black tracking-tight text-textMain">{t('product:product_list')}</h1>
        <Link
          to="/admin/products/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          {t('product:add_new')}
        </Link>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-64 rounded border border-gray-300 p-2"
        />
        
        <select
            value={categoryId || ''}
            onChange={handleCategoryChange}
            className="w-full sm:w-48 rounded border border-gray-300 p-2"
        >
            <option value="">{t('common:all_categories') || 'All Categories'}</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
            ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-surface rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/20 text-textMain border-b border-secondary">
              <th className="p-4">ID</th>
              <th className="p-4">{t('product:image')}</th>
              <th className="p-4">{t('product:name')}</th>
              <th className="p-4">{t('product:category')}</th>
              <th className="p-4">{t('product:price')}</th>
              <th className="p-4">{t('product:status')}</th>
              <th className="p-4">{t('common:actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: Product) => (
              <tr key={product.id} className="border-b border-secondary hover:bg-secondary/10">
                <td className="p-4 text-textMain">{product.id}</td>
                <td className="p-4">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-4 text-textMain font-medium">{product.name}</td>
                <td className="p-4 text-textMain">{product.category?.name || '-'}</td>
                <td className="p-4 text-textMain">{product.price.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isAvailable ? t('product:available') : t('product:unavailable')}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      {t('common:edit')}
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      {t('common:delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products?.length === 0 && (
            <div className="p-6 text-center text-gray-500">
                {t('common:no_data')}
            </div>
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

export default ProductListPage;
