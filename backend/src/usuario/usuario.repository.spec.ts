import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('UsuarioRepository', () => {
  let repository: UsuarioRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    usuario: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UsuarioRepository>(UsuarioRepository);
    prismaService = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(repository).toBeDefined();
  });

  describe('findTipoUsuario', () => {
    it('debe retornar el tipo de usuario cuando existe', async () => {
      // Arrange
      const identificacionUsuario = '1234567890';
      const mockUsuario = { tipoUsuario: 1 };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUsuario);

      // Act
      const result = await repository.findTipoUsuario(identificacionUsuario);

      // Assert
      expect(prismaService.usuario.findUnique).toHaveBeenCalledWith({
        where: { identificacionUsuario },
        select: { tipoUsuario: true },
      });
      expect(result).toBe(1);
    });

    it('debe retornar tipo 2 (Empleado) correctamente', async () => {
      // Arrange
      const identificacionUsuario = '2345678901';
      const mockUsuario = { tipoUsuario: 2 };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUsuario);

      // Act
      const result = await repository.findTipoUsuario(identificacionUsuario);

      // Assert
      expect(result).toBe(2);
    });

    it('debe retornar tipo 3 (Invitado) correctamente', async () => {
      // Arrange
      const identificacionUsuario = '3456789012';
      const mockUsuario = { tipoUsuario: 3 };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUsuario);

      // Act
      const result = await repository.findTipoUsuario(identificacionUsuario);

      // Assert
      expect(result).toBe(3);
    });

    it('debe lanzar NotFoundException cuando el usuario no existe', async () => {
      // Arrange
      const identificacionUsuario = 'noexiste123';
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        repository.findTipoUsuario(identificacionUsuario),
      ).rejects.toThrow(NotFoundException);

      await expect(
        repository.findTipoUsuario(identificacionUsuario),
      ).rejects.toThrow('Usuario no encontrado.');
    });

    it('debe propagar errores de la base de datos', async () => {
      // Arrange
      const identificacionUsuario = '1234567890';
      const dbError = new Error('Error de conexión a la base de datos');
      mockPrismaService.usuario.findUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        repository.findTipoUsuario(identificacionUsuario),
      ).rejects.toThrow('Error de conexión a la base de datos');
    });
  });
});
