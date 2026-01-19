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
    } catch (error) {
      console.error('Checkout failed', error);
      alert(t('messages.checkout_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
        <LanguageSwitcher />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Product List */}
        <div className="flex-1 overflow-y-auto p-4">
          <ProductList onAddToCart={handleAddToCart} />
        </div>

        {/* Right Column: Cart */}
        <div className="w-96 border-l bg-white">
          <Cart
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PosPage;
