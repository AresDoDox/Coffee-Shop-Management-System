import api from './api';

export const voucherService = {
  getVouchers: async () => {
    const response = await api.get('/vouchers');
    return response.data;
  },

  getVoucherById: async (id: number) => {
    const response = await api.get(`/vouchers/${id}`);
    return response.data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createVoucher: async (data: any) => {
    const response = await api.post('/vouchers', data);
    return response.data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateVoucher: async (id: number, data: any) => {
    const response = await api.put(`/vouchers/${id}`, data);
    return response.data;
  },

  deleteVoucher: async (id: number) => {
    const response = await api.delete(`/vouchers/${id}`);
    return response.data;
  },

  validateVoucher: async (code: string, orderTotal: number) => {
    const response = await api.post('/vouchers/validate', { code, orderTotal });
    return response.data;
  }
};
