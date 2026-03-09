import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { voucherService } from '../../services/voucher.service';

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
  onCheckout: (voucherCode?: string) => void;
  loading?: boolean;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, loading }) => {
  const { t } = useTranslation('pos');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - appliedDiscount);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setApplyingVoucher(true);
    setVoucherError('');
    try {
      const result = await voucherService.validateVoucher(voucherCode.trim(), subtotal);
      setAppliedDiscount(result.discountAmount);
    } catch (err: unknown) {
      setAppliedDiscount(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setVoucherError(error.response?.data?.error || 'Invalid Voucher');
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleClearVoucher = () => {
    setVoucherCode('');
    setAppliedDiscount(0);
    setVoucherError('');
  };

  return (
    <div className="flex h-full flex-col bg-surface shadow-lg">
      <div className="border-b border-secondary p-4">
        <h2 className="text-xl font-bold text-textMain">{t('cart.title')}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-textMuted">
            <p>{t('cart.empty')}</p>
            <p className="text-sm">{t('cart.empty_instruction')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded bg-background p-3">
                <div className="flex-1">
                  <h4 className="font-medium text-textMain">{item.name}</h4>
                  <p className="text-sm text-textMuted">${item.price.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded border border-secondary bg-surface">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="px-2 py-1 text-textMain hover:bg-background"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-textMain">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="px-2 py-1 text-textMain hover:bg-background"
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

      <div className="border-t border-secondary bg-background p-4">
        {/* Voucher Section */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Voucher Code"
              className="flex-1 rounded border border-secondary px-3 py-2 text-sm"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              disabled={appliedDiscount > 0}
            />
            {appliedDiscount > 0 ? (
              <button
                onClick={handleClearVoucher}
                className="rounded bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Clear
              </button>
            ) : (
              <button
                onClick={handleApplyVoucher}
                disabled={applyingVoucher || !voucherCode}
                className="rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 disabled:opacity-50"
              >
                {applyingVoucher ? '...' : 'Apply'}
              </button>
            )}
          </div>
          {voucherError && <p className="mt-1 text-xs text-red-500">{voucherError}</p>}
        </div>

        <div className="mb-2 flex justify-between text-sm text-textMuted">
          <span>Subtotal:</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        {appliedDiscount > 0 && (
          <div className="mb-2 flex justify-between text-sm text-green-600 font-medium">
            <span>Discount:</span>
            <span>-${appliedDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="mb-4 flex justify-between text-lg font-bold text-textMain">
          <span>{t('cart.total')}:</span>
          <span>${total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => onCheckout(appliedDiscount > 0 ? voucherCode : undefined)}
          disabled={items.length === 0 || loading}
          className="w-full rounded bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-gray-400"
        >
          {loading ? t('cart.processing') : t('cart.pay_now')}
        </button>
      </div>
    </div>
  );
};

export default Cart;
