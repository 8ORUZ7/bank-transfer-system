export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'http://192.168.111.1:5173/'
