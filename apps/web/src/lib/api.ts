import axios from 'axios';

export const TOKEN_KEY = 'oltvia_token';
export const USER_KEY = 'oltvia_user';

/**
 * Backend API kök adresi (ör. http://localhost:8001/api/v1).
 * Öncelik: NEXT_PUBLIC_API_URL. Yoksa sayfanın açıldığı host (localhost, 127.0.0.1 veya ağ IP'si)
 * ve aynı protokol kullanılarak 8001 portuna bağlanılır (HTTPS sayfada mixed-content oluşmaz).
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  // Eski .env.local dosyalarında değer ".../api/v1/auth" olabilir; geriye dönük uyumluluk için kırpılır.
  if (fromEnv) return fromEnv.replace(/\/+$/, '').replace(/\/auth$/, '');
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8001/api/v1`;
  }
  return 'http://localhost:8001/api/v1';
}

export function getAuthApiUrl(): string {
  return `${getApiBaseUrl()}/auth`;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: unknown): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* depolama erişilemezse yok say */
  }
}

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Her isteğe API adresini ve (varsa) JWT Token'ı ekler
api.interceptors.request.use(
  (config) => {
    if (!config.baseURL) config.baseURL = getApiBaseUrl();
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
