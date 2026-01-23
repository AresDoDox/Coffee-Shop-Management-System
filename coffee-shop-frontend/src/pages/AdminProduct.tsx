/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../validations/product.schema';
import type { ProductSchema } from '../validations/product.schema';
import { uploadImage } from '../services/upload.service';
import { createProduct } from '../services/product.service';

const AdminProduct: React.FC = () => {
  const { t } = useTranslation(['product', 'validation', 'common']);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProductSchema>({
    // @ts-expect-error: Complex Zod type mismatch with React Hook Form
    resolver: zodResolver(createProductSchema(t)),
  });

  const imageFile = watch('image');

  // Handle image preview
  React.useEffect(() => {
    if (imageFile && imageFile[0]) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onSubmit = async (data: ProductSchema) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = '';
      
      // 1. Upload Image
      if (data.image && data.image[0]) {
        imageUrl = await uploadImage(data.image[0]);
      }

      // 2. Create Product
      await createProduct({
        name: data.name,
        price: Number(data.price),
        categoryId: Number(data.category),
        imageUrl: imageUrl, // Use the returned Cloudinary URL
      });

      alert(t('common:success'));
      navigate('/'); // Go back to home or product list
    } catch (err) {
      console.error(err);
      setError(t('common:error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">{t('product:add_new')}</h1>

        {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('product:name')}
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
              {t('product:price')}
            </label>
            <input
              type="number"
              {...register('price')}
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
             {errors.price && (
              <span className="text-sm text-red-500">{errors.price.message as string}</span>
            )}
          </div>

          <div>
             <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('product:category')}
            </label>
             <input
              type="text"
              {...register('category')}
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('product:image')}
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('image')}
              className="w-full rounded border border-gray-300 p-2"
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
            className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? t('common:loading') : t('common:submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProduct;
