import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductList from '../components/pos/ProductList';
import Cart from '../components/pos/Cart';
import type { CartItem } from '../components/pos/Cart';
import type { Product } from '../services/product.service';
import { createOrder } from '../services/order.service';
import LanguageSwitcher from '../components/LanguageSwitcher';

const PosPage: React.FC = () => {
  const { t } = useTranslation(['pos', 'common', 'errors']);
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };

      await createOrder(orderData);
      setCart([]);
      alert(t('messages.order_success'));
      setActiveTab('products'); // Return to products after checkout
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
        <LanguageSwitcher />
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Column: Product List - Mobile: Toggle based on activeTab */}
        <div className={`flex-1 overflow-y-auto p-4 ${activeTab === 'cart' ? 'hidden md:block' : ''}`}>
          <ProductList onAddToCart={handleAddToCart} />
        </div>

        {/* Right Column: Cart - Mobile: Toggle based on activeTab */}
        <div className={`w-full md:w-96 border-l border-secondary bg-surface md:block ${activeTab === 'products' ? 'hidden' : 'block'}`}>
          <Cart
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </div>
      </div>

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
