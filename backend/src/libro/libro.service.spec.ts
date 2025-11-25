import { Test, TestingModule } from '@nestjs/testing';
import { LibroService } from './libro.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LibroService', () => {
  let service: LibroService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    libro: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibroService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LibroService>(LibroService);
    prismaService = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todos los libros ordenados por nombre', async () => {
      // Arrange
      const mockLibros = [
        { isbn: '978-0-123456-78-9', nombre: 'Cien años de soledad' },
        { isbn: '978-0-987654-32-1', nombre: 'El Quijote' },
        { isbn: '978-1-234567-89-0', nombre: 'La Odisea' },
      ];

      mockPrismaService.libro.findMany.mockResolvedValue(mockLibros);

      // Act
      const result = await service.findAll();

      // Assert
      expect(prismaService.libro.findMany).toHaveBeenCalledWith({
        orderBy: {
          nombre: 'asc',
        },
      });
      expect(result).toEqual(mockLibros);
      expect(result).toHaveLength(3);
    });

    it('debe retornar un array vacío cuando no hay libros', async () => {
      // Arrange
      mockPrismaService.libro.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(prismaService.libro.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('debe propagar errores de la base de datos', async () => {
      // Arrange
      const dbError = new Error('Error de conexión a la base de datos');
      mockPrismaService.libro.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow(
        'Error de conexión a la base de datos',
      );
    });
  });
});
