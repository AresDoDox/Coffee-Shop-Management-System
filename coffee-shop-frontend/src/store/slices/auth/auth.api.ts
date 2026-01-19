/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, register } from '../../../services/auth.service';

export const loginUser = createAsyncThunk('auth/login', async (data: any, { rejectWithValue }) => {
  try {
    const response = await login(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  } catch (error: any) {
    // In a real app, map backend error codes to keys.
    // For now, return a generic key or specific one if we knew the code.
    return rejectWithValue('errors:login_failed');
  }
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await register(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      if (error.response?.status === 409) {
        return rejectWithValue('errors:user_exists');
      }
      return rejectWithValue('errors:register_failed');
    }
  }
);
