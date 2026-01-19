import api from './api';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};
