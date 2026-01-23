import React, { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { useTranslation } from 'react-i18next';

// Reuse types or define specific ones for Kitchen
interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}
interface KitchenOrder {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items?: OrderItem[]; // Depending on what backend sends
}

const KitchenPage: React.FC = () => {
  const { t } = useTranslation('kitchen');
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit('join_kitchen');
      console.log('Joined kitchen room');
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNewOrder(value: KitchenOrder) {
      console.log('New order received:', value);
      setOrders((previous) => [value, ...previous]);
      // Optional: Play sound here
      // alert(t('notification.new_order')); // Optional: restore if needed
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_order', onNewOrder);

    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_order', onNewOrder);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
        <div
          className={`rounded-full px-4 py-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {isConnected ? t('status.connected') : t('status.disconnected')}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="animate-pulse-once overflow-hidden rounded-lg border-l-4 border-yellow-500 bg-white shadow-lg"
          >
            <div className="flex justify-between border-b bg-gray-50 p-4">
              <span className="text-lg font-bold">{t('order.title', { id: order.id })}</span>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <p className="text-gray-600">
                  {t('order.total')}: ${order.totalAmount}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  {t('order.status')}:{' '}
                  <span className="font-semibold text-yellow-600">{order.status}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 text-center">
              <button className="font-semibold text-blue-600 hover:text-blue-800">
                {t('order.mark_done')}
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-400">
            <p className="text-xl">{t('empty.title')}</p>
            <p>{t('empty.message')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenPage;
