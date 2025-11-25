export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  usuarios: `${API_BASE_URL}/api/usuario`,
  libros: `${API_BASE_URL}/api/libro`,
  prestamos: `${API_BASE_URL}/api/prestamo`,
} as const;
