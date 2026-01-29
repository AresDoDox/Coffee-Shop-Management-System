import api from './api';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  description?: string;
  isAvailable?: boolean;
  category?: {
    id: number;
    name: string;
  };
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  data: Product[];
  meta: Meta;
}

export const getProducts = async (params?: { page?: number; limit?: number; search?: string; categoryId?: number }): Promise<ProductResponse> => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id'>>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

