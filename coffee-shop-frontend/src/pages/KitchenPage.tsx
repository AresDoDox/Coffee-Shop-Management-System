import React, { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { useTranslation } from 'react-i18next';
import { updateOrderStatus, getActiveOrders } from '../services/order.service';

// Reuse types or define specific ones for Kitchen
interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  product?: { name: string }; // Optional product details
}
interface KitchenOrder {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderitem?: OrderItem[]; // Prisma uses lowercase relation name by default or strict camelCase? Check backend return.
  // Backend returns "orderitem" array based on include
  items?: OrderItem[]; // Frontend might map this
}

const KitchenPage: React.FC = () => {
  const { t } = useTranslation('kitchen');
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const data = await getActiveOrders();
            // Map backend "orderitem" to "items" if necessary, or just use data directly
            // Backend returns array of orders with "orderitem"
            setOrders(data); 
        } catch (error) {
            console.error("Failed to fetch active orders", error);
        }
    };

    fetchOrders();

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
    }

    function onOrderUpdated(updatedOrder: KitchenOrder) {
       setOrders((prev) => 
         prev.map(o => o.id === updatedOrder.id ? updatedOrder : o)
             .filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED') // Remove completed and cancelled orders
       );
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_order', onNewOrder);
    socket.on('order_updated', onOrderUpdated);

    if (socket.connected) {
        onConnect();
    } else {
        socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_order', onNewOrder);
      socket.off('order_updated', onOrderUpdated);
      socket.disconnect();
    };
  }, []);

  const handleMarkDone = async (id: number) => {
    try {
        await updateOrderStatus(id, 'COMPLETED');
        // Optimistic update
        setOrders(prev => prev.filter(o => o.id !== id));
    } catch (error) {
        console.error("Failed to mark order as done", error);
        alert(t('error.update_failed'));
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-textMain">{t('title')}</h1>
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
            className="animate-pulse-once overflow-hidden rounded-lg border-l-4 border-primary bg-surface shadow-lg"
          >
            <div className="flex justify-between border-b border-secondary bg-background p-4">
              <span className="text-lg font-bold text-textMain">{t('order.title', { id: order.id })}</span>
              <span className="text-sm text-textMuted">
                {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <p className="text-textMain">
                  {t('order.total')}: ${order.totalAmount}
                </p>
                <div className="mt-2 text-sm text-textMuted">
                  {t('order.status')}:{' '}
                  <span className="font-semibold text-yellow-600">{order.status}</span>
                </div>
              </div>
            </div>
            <div className="bg-background p-3 text-center">
              <button 
                onClick={() => handleMarkDone(order.id)}
                className="font-semibold text-primary hover:text-primary/80"
              >
                {t('order.mark_done')}
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-textMuted">
            <p className="text-xl">{t('empty.title')}</p>
            <p>{t('empty.message')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenPage;
