import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Libro } from '@prisma/client';
import { CreateLibroDto } from './dto/create-libro.dto';

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

  async create(createLibroDto: CreateLibroDto): Promise<Libro> {
    const existingLibro = await this.prisma.libro.findUnique({
      where: { isbn: createLibroDto.isbn },
    });

    if (existingLibro) {
      throw new ConflictException('El libro ya existe');
    }

    return this.prisma.libro.create({
      data: createLibroDto,
    });
  }
}
