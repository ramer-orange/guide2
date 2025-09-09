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

export { web, api };