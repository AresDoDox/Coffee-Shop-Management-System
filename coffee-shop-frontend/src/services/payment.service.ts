import api from './api';

export interface PaymentQRResponse {
  orderId: number;
  amount: number;
  qrUrl: string;
}

export const getPaymentQR = async (orderId: number): Promise<PaymentQRResponse> => {
  const response = await api.get(`/payment/qr/${orderId}`);
  return response.data;
};
