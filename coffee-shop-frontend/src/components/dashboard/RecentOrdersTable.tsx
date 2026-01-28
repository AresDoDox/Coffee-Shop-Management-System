import React from 'react';
import { useTranslation } from 'react-i18next';

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: { name: string };
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-textMain">{t('recent_orders')}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-textMuted">
              <th className="pb-3 font-medium">{t('table.order_id')}</th>
              <th className="pb-3 font-medium">{t('table.staff')}</th>
              <th className="pb-3 font-medium">{t('table.amount')}</th>
              <th className="pb-3 font-medium">{t('table.time')}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="group hover:bg-background">
                <td className="py-3 font-medium text-textMain">#{order.id}</td>
                <td className="py-3 text-gray-600">{order.user?.name}</td>
                <td className="py-3 font-bold text-primary">${order.totalAmount.toLocaleString()}</td>
                <td className="py-3 text-textMuted">{new Date(order.createdAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
