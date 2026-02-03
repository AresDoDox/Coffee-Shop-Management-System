import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { getPaymentQR } from '../services/payment.service';
import { getOrderById } from '../services/order.service';
import { socket } from '../services/socket';
import { Invoice } from '../components/Invoice';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('payment');
  const [isPaid, setIsPaid] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const orderId = Number(id);

  // Fetch Payment QR Data
  const { data: payData, isLoading, error } = useQuery({
    queryKey: ['paymentQR', orderId],
    queryFn: () => getPaymentQR(orderId),
    enabled: !!orderId && !isPaid,
  });

  // Fetch Full Order Data for Invoice (only when paid)
  const { data: orderData } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId && isPaid,
  });

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${orderId}`,
    onAfterPrint: () => {
        // Optional: navigate back after printing?
        // navigate('/pos'); 
    }
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
        // Removed auto-redirect to allow printing
      }
    };

    socket.on(eventName, handlePaymentUpdate);

    return () => {
      socket.off(eventName, handlePaymentUpdate);
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
        
        <div className="mt-8 flex flex-col gap-4 w-64">
            <button 
                onClick={() => handlePrint()}
                disabled={!orderData}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 flex justify-center items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {t('print_invoice')}
            </button>
            
            <button 
                onClick={() => navigate('/pos')}
                className="w-full rounded-lg border border-green-600 py-3 font-semibold text-green-800 hover:bg-green-100"
            >
                {t('back_to_pos')}
            </button>
        </div>

        {/* Hidden Invoice Component for Printing */}
        <div style={{ display: 'none' }}>
            <Invoice ref={invoiceRef} order={orderData} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">{t('scan_to_pay')}</h1>
        
        {payData?.qrUrl && (
          <div className="mb-6 flex justify-center">
            <img src={payData.qrUrl} alt="VietQR" className="h-64 w-64 object-contain" />
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-500">{t('order_id')}: #{orderId}</p>
          <p className="mt-2 text-3xl font-bold text-primary">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payData?.amount || 0)}
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
