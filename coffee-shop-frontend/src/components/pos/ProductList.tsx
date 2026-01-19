import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../../services/product.service';
import type { Product } from '../../services/product.service';
import ProductItem from './ProductItem';

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const { t } = useTranslation('pos');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center">{t('product.loading')}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} onAdd={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductList;
