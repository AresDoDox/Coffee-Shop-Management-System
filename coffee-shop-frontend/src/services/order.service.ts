
import api from './api';

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: 'QR' | 'CASH';
}

export const createOrder = async (data: CreateOrderDto) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
}

export const cancelOrder = async (id: number) => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
}

export const updatePaymentStatus = async (id: number, paymentMethod: string, paymentStatus: string) => {
    const response = await api.patch(`/orders/${id}/payment`, { paymentMethod, paymentStatus });
    return response.data;
}
