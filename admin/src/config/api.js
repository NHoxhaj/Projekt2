import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiUrl = (path) => `${API_URL}${path}`;

export const assetUrl = (path) => {
  if (!path || path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  return apiUrl(path.startsWith('/') ? path : `/${path}`);
};

const getCookie = (name) => {
  if (typeof document === 'undefined') {
    return '';
  }

  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
};

let csrfTokenRequest;

const getCsrfToken = async () => {
  const existingToken = getCookie('csrfToken');
  if (existingToken) {
    return decodeURIComponent(existingToken);
  }

  csrfTokenRequest ||= axios
    .get(apiUrl('/api/csrf-token'), { withCredentials: true })
    .then((response) => response.data.csrfToken)
    .finally(() => {
      csrfTokenRequest = null;
    });

  return csrfTokenRequest;
};

export const setupCsrfProtection = () => {
  axios.interceptors.request.use(async (config) => {
    const method = config.method?.toUpperCase();

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      config.headers = config.headers || {};
      config.headers['X-CSRF-Token'] = await getCsrfToken();
    }

    return config;
  });
};
