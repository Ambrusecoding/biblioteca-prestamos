export interface Usuario {
  identificacionUsuario: string;
  tipoUsuario: number;
}

export interface Libro {
  isbn: string;
  nombre: string;
}

export interface Prestamo {
  id: string;
  isbn: string;
  nombreLibro?: string;
  identificacionUsuario: string;
  fechaPrestamo?: string;
  fechaMaximaDevolucion: string;
  tipoUsuario?: number;
}

