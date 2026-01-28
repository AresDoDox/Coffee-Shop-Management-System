import api from './api';

export interface DashboardStats {
  revenue: number;
  totalOrders: number;
  topSelling: {
    name: string;
    totalSold: number;
    revenue: number;
  }[];
  recentOrders: {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { name: string };
  }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/stats/dashboard');
  return response.data;
};
