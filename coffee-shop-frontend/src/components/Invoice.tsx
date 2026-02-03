
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Order } from '../services/order.service';

interface InvoiceProps {
  order?: Order;
}

export const Invoice = forwardRef<HTMLDivElement, InvoiceProps>((props, ref) => {
  const { order } = props;
  const { t } = useTranslation('payment');

  if (!order) return null;

  const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleString('vi-VN');
      } catch {
        return dateString;
      }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div ref={ref} className="invoice-container font-mono p-4" style={{ width: '80mm', color: 'black', background: 'white' }}>
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold uppercase">{t('invoice.title')}</h1>
        <p className="text-sm">{t('invoice.address')}</p>
        <p className="text-sm">{t('invoice.tel')}</p>
      </div>

      <div className="border-b border-black mb-2 border-dashed"></div>

      <div className="mb-2 text-sm">
        <p>{t('invoice.invoice_no')}: {order.id}</p>
        <p>{t('invoice.date')}: {formatDate(order.createdAt)}</p>
        <p>{t('invoice.cashier')}: Admin</p>
      </div>

      <div className="border-b border-black mb-2 border-dashed"></div>

      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-left">
            <th className="py-1">{t('invoice.item')}</th>
            <th className="py-1 text-right">{t('invoice.qty')}</th>
            <th className="py-1 text-right">{t('invoice.price')}</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item) => (
            <tr key={item.id}>
              <td className="py-1 pr-2">
                <div className="font-bold">{item.product?.name || `Product #${item.productId}`}</div>
              </td>
              <td className="py-1 text-right">{item.quantity}</td>
              <td className="py-1 text-right">{formatCurrency(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-b border-black mb-2 border-dashed"></div>

      <div className="flex justify-between font-bold text-lg mb-4">
        <span>{t('invoice.total')}:</span>
        <span>{formatCurrency(order.totalAmount)}</span>
      </div>

      <div className="text-center text-sm mb-8">
        <p>{t('invoice.payment_method')}: {order.paymentMethod} ({order.paymentStatus})</p>
        <p className="mt-4 italic">{t('invoice.thank_you')}</p>
      </div>
      
      {/* Footer margin for printer cutter */}
      <div className="mb-8"></div>
    </div>
  );
});

Invoice.displayName = 'Invoice';
