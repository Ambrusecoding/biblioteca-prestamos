import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    usuario: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    prismaService = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todos los usuarios ordenados por identificación', async () => {
      // Arrange
      const mockUsuarios = [
        { identificacionUsuario: '1234567890', tipoUsuario: 1 },
        { identificacionUsuario: '2345678901', tipoUsuario: 2 },
        { identificacionUsuario: '3456789012', tipoUsuario: 3 },
      ];

      mockPrismaService.usuario.findMany.mockResolvedValue(mockUsuarios);

      // Act
      const result = await service.findAll();

      // Assert
      expect(prismaService.usuario.findMany).toHaveBeenCalledWith({
        orderBy: {
          identificacionUsuario: 'asc',
        },
      });
      expect(result).toEqual(mockUsuarios);
      expect(result).toHaveLength(3);
    });

    it('debe retornar un array vacío cuando no hay usuarios', async () => {
      // Arrange
      mockPrismaService.usuario.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(prismaService.usuario.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('debe verificar que retorna diferentes tipos de usuario', async () => {
      // Arrange
      const mockUsuarios = [
        { identificacionUsuario: '1111111111', tipoUsuario: 1 }, // Afiliado
        { identificacionUsuario: '2222222222', tipoUsuario: 2 }, // Empleado
        { identificacionUsuario: '3333333333', tipoUsuario: 3 }, // Invitado
      ];

      mockPrismaService.usuario.findMany.mockResolvedValue(mockUsuarios);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result[0].tipoUsuario).toBe(1);
      expect(result[1].tipoUsuario).toBe(2);
      expect(result[2].tipoUsuario).toBe(3);
    });

    it('debe propagar errores de la base de datos', async () => {
      // Arrange
      const dbError = new Error('Error de conexión a la base de datos');
      mockPrismaService.usuario.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow(
        'Error de conexión a la base de datos',
      );
    });
  });
});
