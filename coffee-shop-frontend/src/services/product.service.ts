import api from './api';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post('/products', product);
  return response.data;
};
