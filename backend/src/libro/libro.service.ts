import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Libro } from '@prisma/client';

@Injectable()
export class LibroService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Libro[]> {
    return this.prisma.libro.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }
}
