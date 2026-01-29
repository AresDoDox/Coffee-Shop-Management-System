import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../../services/product.service';
import type { Product } from '../../services/product.service';
import ProductItem from './ProductItem';

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const { t } = useTranslation('pos');

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', 'pos'], // Distinct key for POS
    queryFn: () => getProducts({ page: 1, limit: 100 }), // Fetch more for POS
    select: (response) => response.data.filter((product) => product.isAvailable !== false),
  });

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">{t('product.loading')}</div>;
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">Error loading products</div>;
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
