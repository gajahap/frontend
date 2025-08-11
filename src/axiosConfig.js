import axios from 'axios';

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: 'http://192.168.2.35:8000/api/v1/', // base URL API kamu
  headers: {
    'Content-Type': 'application/json',
    // Tambahkan Authorization jika ada token
    'Authorization': `Bearer ${token}`,
  },
  // kamu juga bisa menambahkan timeout, interceptors, dll di sini
});

export default axiosInstance;
