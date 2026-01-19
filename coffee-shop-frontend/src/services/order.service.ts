
import api from './api';

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
  totalAmount: number;
}

export const createOrder = async (data: CreateOrderDto) => {
  const response = await api.post('/orders', data);
  return response.data;
};
