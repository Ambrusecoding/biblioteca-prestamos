import { API_ENDPOINTS } from "../config/api";
import type { Usuario, Libro, Prestamo } from "../types";

class ApiService {
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    return response.json();
  }

  async getUsuarios(): Promise<Usuario[]> {
    return this.fetchData<Usuario[]>(API_ENDPOINTS.usuarios);
  }

  async getLibros(): Promise<Libro[]> {
    return this.fetchData<Libro[]>(API_ENDPOINTS.libros);
  }

  async getPrestamos(): Promise<Prestamo[]> {
    return this.fetchData<Prestamo[]>(API_ENDPOINTS.prestamos);
  }

  async createPrestamo(data: {
    identificacionUsuario: string;
    isbn: string;
  }): Promise<Prestamo> {
    const response = await fetch(API_ENDPOINTS.prestamos, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `Error al crear préstamo: ${response.statusText}`;
      try {
        const errorData = (await response.json()) as { message?: string };
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Ignorar error de parsing
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const apiService = new ApiService();

export type { Usuario, Libro, Prestamo } from "../types";
