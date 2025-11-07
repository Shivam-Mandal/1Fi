import { api } from './api';

export const fetchProducts = async () => {
  try {
    const res = await api.get('/products');
    return res.data;
  } catch (error) {
    console.error('fetchProducts error:', error);
    throw error;
  }
};

export const fetchProductBySlug = async (slug) => {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  } catch (error) {
    console.error('fetchProductBySlug error:', error);
    throw error;
  }
};