import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Usuario } from '@prisma/client';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      orderBy: {
        identificacionUsuario: 'asc',
      },
    });
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existingUsuario = await this.prisma.usuario.findUnique({
      where: { identificacionUsuario: createUsuarioDto.identificacionUsuario },
    });

    if (existingUsuario) {
      throw new ConflictException('El usuario ya existe');
    }

    return this.prisma.usuario.create({
      data: createUsuarioDto,
    });
  }
}
