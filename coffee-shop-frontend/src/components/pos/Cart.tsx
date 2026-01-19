import React from 'react';
import { useTranslation } from 'react-i18next';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
  loading?: boolean;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, loading }) => {
  const { t } = useTranslation('pos');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex h-full flex-col bg-white shadow-lg">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold text-gray-800">{t('cart.title')}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-500">
            <p>{t('cart.empty')}</p>
            <p className="text-sm">{t('cart.empty_instruction')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded bg-gray-50 p-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">${item.price.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded border bg-white">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t bg-gray-50 p-4">
        <div className="mb-4 flex justify-between text-lg font-bold">
          <span>{t('cart.total')}:</span>
          <span>${total.toLocaleString()}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0 || loading}
          className="w-full rounded bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? t('cart.processing') : t('cart.pay_now')}
        </button>
      </div>
    </div>
  );
};

export default Cart;
