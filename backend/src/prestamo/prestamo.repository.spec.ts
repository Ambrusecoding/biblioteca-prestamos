import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrestamoRepository } from './prestamo.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('PrestamoRepository', () => {
  let repository: PrestamoRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockPrismaService = {
    prestamo: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestamoRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrestamoRepository>(PrestamoRepository);
    prismaService = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    const prestamoData = {
      isbn: '978-0-123456-78-9',
      identificacionUsuario: '1234567890',
      fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
      fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
    };

    it('debe crear un préstamo exitosamente', async () => {
      // Arrange
      const mockPrestamo = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...prestamoData,
        libro: {
          isbn: prestamoData.isbn,
          nombre: 'El Quijote',
        },
      };

      mockPrismaService.prestamo.create.mockResolvedValue(mockPrestamo);

      // Act
      const result = await repository.save(prestamoData);

      // Assert
      expect(prismaService.prestamo.create).toHaveBeenCalledWith({
        data: prestamoData,
        include: {
          libro: true,
        },
      });
      expect(result).toEqual(mockPrestamo);
      expect(result.libro.nombre).toBe('El Quijote');
    });

    it('debe lanzar InternalServerErrorException en caso de error', async () => {
      // Arrange
      const dbError = new Error('Error de base de datos');
      mockPrismaService.prestamo.create.mockRejectedValue(dbError);

      // Spy on console.error
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act & Assert
      await expect(repository.save(prestamoData)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(repository.save(prestamoData)).rejects.toThrow(
        'Error al guardar el préstamo en la base de datos.',
      );

      // Verify console.error was called
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });

  describe('findById', () => {
    it('debe retornar un préstamo cuando existe', async () => {
      // Arrange
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const mockPrestamo = {
        id,
        isbn: '978-0-123456-78-9',
        identificacionUsuario: '1234567890',
        fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
        fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
        libro: {
          isbn: '978-0-123456-78-9',
          nombre: 'El Quijote',
        },
      };

      mockPrismaService.prestamo.findUnique.mockResolvedValue(mockPrestamo);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(prismaService.prestamo.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          libro: true,
        },
      });
      expect(result).toEqual(mockPrestamo);
      expect(result.libro.nombre).toBe('El Quijote');
    });

    it('debe lanzar NotFoundException cuando el préstamo no existe', async () => {
      // Arrange
      const id = 'id-inexistente';
      mockPrismaService.prestamo.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.findById(id)).rejects.toThrow(NotFoundException);
      await expect(repository.findById(id)).rejects.toThrow(
        'El préstamo no existe',
      );
    });
  });

  describe('countActiveLoansByUser', () => {
    it('debe retornar el número de préstamos activos del usuario', async () => {
      // Arrange
      const identificacionUsuario = '1234567890';
      mockPrismaService.prestamo.count.mockResolvedValue(2);

      // Act
      const result = await repository.countActiveLoansByUser(
        identificacionUsuario,
      );

      // Assert
      expect(prismaService.prestamo.count).toHaveBeenCalledWith({
        where: {
          identificacionUsuario: identificacionUsuario,
        },
      });
      expect(result).toBe(2);
    });

    it('debe retornar 0 cuando el usuario no tiene préstamos', async () => {
      // Arrange
      const identificacionUsuario = '9999999999';
      mockPrismaService.prestamo.count.mockResolvedValue(0);

      // Act
      const result = await repository.countActiveLoansByUser(
        identificacionUsuario,
      );

      // Assert
      expect(result).toBe(0);
    });

    it('debe retornar 1 cuando el usuario tiene un préstamo', async () => {
      // Arrange
      const identificacionUsuario = '3333333333';
      mockPrismaService.prestamo.count.mockResolvedValue(1);

      // Act
      const result = await repository.countActiveLoansByUser(
        identificacionUsuario,
      );

      // Assert
      expect(result).toBe(1);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los préstamos con información de libro y usuario', async () => {
      // Arrange
      const mockPrestamos = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          isbn: '978-0-123456-78-9',
          identificacionUsuario: '1234567890',
          fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
          fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
          libro: { nombre: 'El Quijote' },
          usuario: { identificacionUsuario: '1234567890', tipoUsuario: 1 },
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          isbn: '978-0-987654-32-1',
          identificacionUsuario: '2345678901',
          fechaPrestamo: new Date('2024-01-16T10:00:00Z'),
          fechaMaximaDevolucion: new Date('2024-01-24T10:00:00Z'),
          libro: { nombre: 'Cien años de soledad' },
          usuario: { identificacionUsuario: '2345678901', tipoUsuario: 2 },
        },
      ];

      mockPrismaService.prestamo.findMany.mockResolvedValue(mockPrestamos);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(prismaService.prestamo.findMany).toHaveBeenCalledWith({
        include: {
          libro: true,
          usuario: true,
        },
        orderBy: {
          fechaPrestamo: 'desc',
        },
      });
      expect(result).toEqual(mockPrestamos);
      expect(result).toHaveLength(2);
    });

    it('debe retornar un array vacío cuando no hay préstamos', async () => {
      // Arrange
      mockPrismaService.prestamo.findMany.mockResolvedValue([]);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('debe verificar que los préstamos incluyan información completa', async () => {
      // Arrange
      const mockPrestamo = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        isbn: '978-0-123456-78-9',
        identificacionUsuario: '1234567890',
        fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
        fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
        libro: { nombre: 'El Quijote' },
        usuario: { identificacionUsuario: '1234567890', tipoUsuario: 1 },
      };

      mockPrismaService.prestamo.findMany.mockResolvedValue([mockPrestamo]);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result[0]).toHaveProperty('libro');
      expect(result[0]).toHaveProperty('usuario');
      expect(result[0].libro).toHaveProperty('nombre');
      expect(result[0].usuario).toHaveProperty('tipoUsuario');
    });
  });
});
