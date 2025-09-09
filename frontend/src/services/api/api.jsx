import axios from 'axios';

// csrf用インスタンス
const web = axios.create({
  baseURL: import.meta.env.VITE_API_ROOT_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// API設定
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// リクエストインターセプターでトークンを設定
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプターで401エラー時の処理
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      // 認証エラー時のリダイレクト処理が必要な場合はここに追加
    }
    return Promise.reject(error);
  }
);

export { web, api };