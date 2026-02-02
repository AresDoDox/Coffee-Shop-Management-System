import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getPaymentQR } from '../services/payment.service';
import { socket } from '../services/socket';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('payment');
  const [isPaid, setIsPaid] = useState(false);

  const orderId = Number(id);

  const { data, isLoading, error } = useQuery({
    queryKey: ['paymentQR', orderId],
    queryFn: () => getPaymentQR(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (!orderId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const eventName = `payment_update_${orderId}`;
    
    // Define the listener
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePaymentUpdate = (payload: any) => {
      if (payload.status === 'PAID') {
        setIsPaid(true);
        // Navigate back to POS after 3 seconds
        setTimeout(() => {
            navigate('/pos');
        }, 3000);
      }
    };

    socket.on(eventName, handlePaymentUpdate);

    return () => {
      socket.off(eventName, handlePaymentUpdate);
      // Optional: don't disconnect if socket is used elsewhere, 
      // but for this specific flow it might be mostly independent.
      // Keeping it connected is usually safer for SPA.
    };
  }, [orderId, navigate]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">{t('loading_qr')}</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{t('error_loading')}</div>;
  if (isPaid) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-green-50">
        <div className="rounded-full bg-green-100 p-6">
          <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-green-800">{t('payment_success')}</h2>
        <p className="mt-2 text-gray-600">{t('redirecting')}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">{t('scan_to_pay')}</h1>
        
        {data?.qrUrl && (
          <div className="mb-6 flex justify-center">
            <img src={data.qrUrl} alt="VietQR" className="h-64 w-64 object-contain" />
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-500">{t('order_id')}: #{orderId}</p>
          <p className="mt-2 text-3xl font-bold text-primary">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.amount || 0)}
          </p>
          <p className="mt-4 animate-pulse text-sm text-blue-600">{t('waiting_confirmation')}</p>
        </div>
        
        <button 
          onClick={() => navigate('/pos')}
          className="mt-8 w-full rounded-lg bg-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-300"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
