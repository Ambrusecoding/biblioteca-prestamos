import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prestamo } from '@prisma/client';

@Injectable()
export class PrestamoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: {
    isbn: string;
    identificacionUsuario: string;
    fechaPrestamo: Date;
    fechaMaximaDevolucion: Date;
  }): Promise<Prestamo & { libro: { nombre: string } }> {
    try {
      const prestamo = await this.prisma.prestamo.create({
        data,
        include: {
          libro: true,
        },
      });

      return prestamo as Prestamo & { libro: { nombre: string } };
    } catch (error) {
      console.error('Error al guardar el préstamo:', error);
      throw new InternalServerErrorException(
        'Error al guardar el préstamo en la base de datos.',
      );
    }
  }

  async findById(
    id: string,
  ): Promise<Prestamo & { libro: { nombre: string } }> {
    const prestamo = await this.prisma.prestamo.findUnique({
      where: { id },
      include: {
        libro: true,
      },
    });

    if (!prestamo) {
      throw new NotFoundException('El préstamo no existe');
    }

    return prestamo as Prestamo & { libro: { nombre: string } };
  }

  async countActiveLoansByUser(identificacionUsuario: string): Promise<number> {
    return await this.prisma.prestamo.count({
      where: {
        identificacionUsuario: identificacionUsuario,
      },
    });
  }

  async findAll(): Promise<
    (Prestamo & {
      libro: { nombre: string };
      usuario: { identificacionUsuario: string; tipoUsuario: number };
    })[]
  > {
    return this.prisma.prestamo.findMany({
      include: {
        libro: true,
        usuario: true,
      },
      orderBy: {
        fechaPrestamo: 'desc',
      },
    });
  }
}
