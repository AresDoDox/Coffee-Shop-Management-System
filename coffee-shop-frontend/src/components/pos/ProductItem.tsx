import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../services/product.service';

interface ProductItemProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onAdd }) => {
  const { t } = useTranslation('pos');

  return (
    <div
      onClick={() => onAdd(product)}
      className="cursor-pointer overflow-hidden rounded-lg bg-surface shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="h-32 w-full bg-secondary">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-textMuted">
            {t('product.no_image')}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-textMain">{product.name}</h3>
        <p className="font-bold text-primary">${product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductItem;
