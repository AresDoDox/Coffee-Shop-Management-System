import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { socket } from '../services/socket';
import ProductList from '../components/pos/ProductList';
import Cart from '../components/pos/Cart';
import type { CartItem } from '../components/pos/Cart';
import type { Product } from '../services/product.service';
import { createOrder } from '../services/order.service';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import RecentOrdersModal from '../components/pos/RecentOrdersModal';

const PosPage: React.FC = () => {
  const { t } = useTranslation(['pos', 'common', 'errors']);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRecentOrders, setShowRecentOrders] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemove = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Socket Listener for Kitchen Notifications
  React.useEffect(() => {
    const onOrderReady = (order: { id: number }) => {
        // Simple notification sound (optional)
        // const audio = new Audio('/sounds/notification.mp3');
        // audio.play().catch(e => console.log('Audio play failed', e));
        
        // Show notification (Using built-in browser API or custom UI)
        // For now, let's use a custom UI state or Alert (migrating to Toast later)
        alert(t('common:notification.order_ready', { id: order.id }));
    };

    socket.on('order_ready', onOrderReady);
    return () => {
        socket.off('order_ready', onOrderReady);
    };
  }, [t]);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const processPayment = async (method: 'CASH' | 'QR') => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod: method,
      };

      const newOrder = await createOrder(orderData);
      
      if (method === 'QR') {
        navigate(`/payment/${newOrder.id}`);
      } else {
        setCart([]);
        alert(t('messages.order_success'));
        setActiveTab('products');
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error('Checkout failed', error);
      alert(t('messages.checkout_failed'));
    } finally {
      setLoading(false);
    }
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between bg-surface px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-textMain">{t('title')}</h1>
        <div className="flex items-center gap-4">
             <button
               onClick={() => setShowRecentOrders(true)}
               className="rounded-lg bg-secondary px-4 py-2 font-medium text-textMain hover:bg-secondary/80"
             >
               {t('recent_orders.title')}
             </button>
             <LanguageSwitcher />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Column: Product List */}
        <div className={`flex-1 overflow-y-auto p-4 ${activeTab === 'cart' ? 'hidden md:block' : ''}`}>
          <ProductList onAddToCart={handleAddToCart} />
        </div>

        {/* Right Column: Cart */}
        <div className={`w-full md:w-96 border-l border-secondary bg-surface md:block ${activeTab === 'products' ? 'hidden' : 'block'}`}>
          <Cart
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onCheckout={handleCheckoutClick}
            loading={loading}
          />
        </div>
      </div>

      {/* Payment Selection Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity animate-fade-in">
          <div className="w-full max-w-sm scale-100 transform rounded-2xl bg-white p-6 shadow-2xl transition-all animate-scale-up">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-800">{t('pos:messages.select_payment_method')}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => processPayment('CASH')}
                disabled={loading}
                className="group flex flex-col items-center justify-center rounded-xl bg-green-50 p-6 transition-all hover:bg-green-100 hover:shadow-md disabled:opacity-50"
              >
                <div className="mb-3 rounded-full bg-green-100 p-3 text-green-600 group-hover:bg-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-green-700">{t('pos:messages.cash')}</span>
              </button>
              
              <button
                onClick={() => processPayment('QR')}
                disabled={loading}
                className="group flex flex-col items-center justify-center rounded-xl bg-blue-50 p-6 transition-all hover:bg-blue-100 hover:shadow-md disabled:opacity-50"
              >
                <div className="mb-3 rounded-full bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="font-semibold text-blue-700">{t('pos:messages.transfer')}</span>
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              disabled={loading}
              className="mt-6 w-full rounded-lg border border-gray-200 py-3 font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              {t('pos:messages.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Recent Orders Modal */}
      {showRecentOrders && (
        <RecentOrdersModal onClose={() => setShowRecentOrders(false)} />
      )}

      {/* Mobile Bottom Tab Bar */}
      <div className="flex h-16 border-t border-secondary bg-surface md:hidden">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 ${
            activeTab === 'products' ? 'text-primary font-bold' : 'text-textMuted'
          }`}
        >
          <span>Menu</span>
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 relative ${
            activeTab === 'cart' ? 'text-primary font-bold' : 'text-textMuted'
          }`}
        >
           <span>Cart</span>
           {cartItemCount > 0 && (
             <span className="absolute top-2 right-8 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
               {cartItemCount}
             </span>
           )}
        </button>
      </div>
    </div>
  );
};

export default PosPage;
