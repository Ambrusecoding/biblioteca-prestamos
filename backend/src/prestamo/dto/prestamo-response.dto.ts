import { ApiProperty } from '@nestjs/swagger';
import { Prestamo } from '@prisma/client';

interface PrestamoWithLibro extends Prestamo {
  libro: { nombre: string };
}

interface PrestamoWithUsuario extends PrestamoWithLibro {
  usuario?: { identificacionUsuario: string; tipoUsuario: number };
}

export class PrestamoResponseDto {
  @ApiProperty({
    description: 'ID único del préstamo',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ISBN del libro prestado',
    example: '978-0-123456-78-9',
  })
  isbn: string;

  @ApiProperty({
    description: 'Nombre del libro prestado',
    example: 'El Quijote de la Mancha',
    required: false,
  })
  nombreLibro?: string;

  @ApiProperty({
    description: 'Identificación del usuario',
    example: '1234567890',
  })
  identificacionUsuario: string;

  @ApiProperty({
    description: 'Fecha en que se realizó el préstamo',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  fechaPrestamo?: Date;

  @ApiProperty({
    description: 'Fecha máxima para devolver el libro',
    example: '2024-01-22T10:30:00Z',
  })
  fechaMaximaDevolucion: Date;

  @ApiProperty({
    description: 'Tipo de usuario (1: Afiliado, 2: Empleado, 3: Invitado)',
    example: 1,
    enum: [1, 2, 3],
    required: false,
  })
  tipoUsuario?: number;

  constructor(data: PrestamoWithLibro | PrestamoWithUsuario) {
    this.id = data.id;
    this.isbn = data.isbn;
    this.identificacionUsuario = data.identificacionUsuario;
    this.fechaPrestamo = data.fechaPrestamo;
    this.fechaMaximaDevolucion = data.fechaMaximaDevolucion;

    if (data.libro) {
      this.nombreLibro = data.libro.nombre;
    }

    if ('usuario' in data && data.usuario) {
      this.tipoUsuario = data.usuario.tipoUsuario;
    }
  }
}
