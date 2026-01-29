import api from './api';

export interface Category {
  id: number;
  name: string;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryResponse {
  data: Category[];
  meta: Meta;
}

export const getCategories = async (params?: { page?: number; limit?: number; search?: string }): Promise<CategoryResponse> => {
  const response = await api.get('/categories', { params });
  return response.data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const response = await api.post('/categories', { name });
  return response.data;
};

export const updateCategory = async (id: number, name: string): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, { name });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
