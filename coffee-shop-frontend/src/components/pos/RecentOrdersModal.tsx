/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { cancelOrder, updatePaymentStatus } from '../../services/order.service';

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  items?: any[];
}

interface RecentOrdersModalProps {
  onClose: () => void;
}

const RecentOrdersModal: React.FC<RecentOrdersModalProps> = ({ onClose }) => {
  const { t } = useTranslation('pos');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Basic fetch, in real app needs pagination/filtering
      const response = await api.get('/orders'); 
      // Note: Reusing stats endpoint or create specialized one. 
      // Ideally should create a specialized endpoint for active orders only.
      // For now assume we use the stats endpoint but in real world better to filter by status != COMPLETED
       setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm(t('messages.confirm_cancel'))) return;
    try {
      await cancelOrder(id);
      fetchOrders(); // Refresh
      alert(t('messages.cancel_success'));
    } catch (error) {
      alert(t('messages.error_cancel'));
    }
  };

  const handleSwitchToCash = async (id: number) => {
    try {
      await updatePaymentStatus(id, 'CASH', 'PAID');
      fetchOrders(); // Refresh
      alert(t('messages.payment_updated'));
    } catch (error) {
        alert(t('messages.error_payment'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl rounded-lg bg-surface p-6 shadow-xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{t('recent_orders.title')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">{t('recent_orders.close')}</button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {loading ? <p>{t('recent_orders.loading')}</p> : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">{t('recent_orders.id')}</th>
                            <th className="p-2">{t('recent_orders.total')}</th>
                            <th className="p-2">{t('recent_orders.status')}</th>
                            <th className="p-2">{t('recent_orders.payment')}</th>
                            <th className="p-2">{t('recent_orders.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">#{order.id}</td>
                                <td className="p-2">${order.totalAmount}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded text-xs ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-2">{order.paymentMethod} ({order.paymentStatus})</td>
                                <td className="p-2 flex gap-2">
                                    {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                        <>
                                            <button 
                                                onClick={() => handleCancel(order.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                {t('messages.cancel')}
                                            </button>
                                            {order.paymentMethod === 'QR' && order.paymentStatus !== 'PAID' && (
                                                <button 
                                                    onClick={() => handleSwitchToCash(order.id)}
                                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                >
                                                    {t('recent_orders.pay_cash')}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersModal;
