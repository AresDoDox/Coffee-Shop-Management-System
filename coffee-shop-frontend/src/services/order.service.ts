
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
  const result = response.data;
  if(result.orderitem && !result.items) {
      result.items = result.orderitem;
  }
  return result;
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


export interface Order {
    id: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
    items: {
        id: number;
        productId: number;
        quantity: number;
        price: number;
        product?: {
            name: string;
        };
    }[];
}


export const getOrderById = async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    const data = response.data;
    
    // Map backend response (orderitem) to frontend interface (items)
    // The backend returns 'orderitem' (Prisma default for validation) 
    // but our frontend uses 'items'
    if (data.orderitem && !data.items) {
        data.items = data.orderitem;
    }
    
    return data;
}

export const getActiveOrders = async () => {
    const response = await api.get('/orders/active');
    // Ensure we handle potential data format issues if backend wraps it
    return response.data;
}
