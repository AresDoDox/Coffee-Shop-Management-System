/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../validations/product.schema';
import type { ProductSchema } from '../validations/product.schema';
import { uploadImage } from '../services/upload.service';
import { createProduct, updateProduct, getProduct } from '../services/product.service';
import { getCategories } from '../services/category.service';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation(['product', 'validation', 'common']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [preview, setPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductSchema>({
    // @ts-expect-error: Complex Zod type mismatch with React Hook Form
    resolver: zodResolver(createProductSchema(t)),
  });

  // Fetch product if in edit mode
  const { data: productData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id)),
    enabled: isEditMode,
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 100 }),
  });
  
  const categories = categoriesResponse?.data || [];

  // Populate form when data is fetched
  useEffect(() => {
    if (productData) {
        setValue('name', productData.name);
        setValue('price', productData.price);
        setValue('category', String(productData.categoryId || ''));
        setValue('description', productData.description || '');
        setValue('isAvailable', productData.isAvailable ?? true);
        if (productData.imageUrl) {
            setPreview(productData.imageUrl);
        }
    }
  }, [productData, setValue]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const imageFile = watch('image');

  // Handle image preview
  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const mutation = useMutation({
    mutationFn: async (data: ProductSchema) => {
      let imageUrl = preview || ''; // Keep existing image if no new one
      
      // 1. Upload Image if new file selected
      if (data.image && data.image[0]) {
        imageUrl = await uploadImage(data.image[0]);
      }

      const productData = {
        name: data.name,
        price: Number(data.price),
        categoryId: Number(data.category),
        description: data.description,
        isAvailable: data.isAvailable,
        imageUrl: imageUrl, 
      };

      // 2. Create or Update Product
      if (isEditMode) {
        return updateProduct(Number(id), productData);
      } else {
        return createProduct(productData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      alert(t('common:success'));
      navigate('/admin/products'); 
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmit = (data: ProductSchema) => {
    mutation.mutate(data);
  };

  const loading = mutation.isPending;
  const error = mutation.error ? t('common:error_occurred') : null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-6">
      <div className="w-full max-w-lg rounded-lg bg-surface p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-textMain">
            {isEditMode ? t('product:edit_product') : t('product:add_new')}
        </h1>

        {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">
              {t('product:name')}
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full rounded border border-secondary p-2 focus:border-primary focus:outline-none"
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name.message as string}</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">
              {t('product:price')}
            </label>
            <input
              type="number"
              {...register('price')}
              className="w-full rounded border border-secondary p-2 focus:border-primary focus:outline-none"
            />
             {errors.price && (
              <span className="text-sm text-red-500">{errors.price.message as string}</span>
            )}
          </div>


          <div>
             <label className="mb-1 block text-sm font-medium text-textMain">
              {t('product:category')}
            </label>
             <select
              {...register('category')}
              className="w-full rounded border border-secondary p-2 focus:border-primary focus:outline-none"
            >
              <option value="">{t('product:select_category')}</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">
              {t('product:description')}
            </label>
            <textarea
              {...register('description')}
              className="w-full rounded border border-secondary p-2 focus:border-primary focus:outline-none"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAvailable"
              {...register('isAvailable')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-textMain">
              {t('product:is_available')}
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-textMain">
              {t('product:image')}
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('image')}
              className="w-full rounded border border-secondary p-2"
            />
            {preview && (
              <div className="mt-4">
                 <img src={preview} alt="Preview" className="h-48 w-full object-cover rounded-md" />
              </div>
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

export default ProductFormPage;
