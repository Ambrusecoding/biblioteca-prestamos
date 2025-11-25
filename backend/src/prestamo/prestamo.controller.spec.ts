import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrestamoController } from './prestamo.controller';
import { PrestamoService } from './prestamo.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { PrestamoResponseDto } from './dto/prestamo-response.dto';

describe('PrestamoController', () => {
  let controller: PrestamoController;
  let service: jest.Mocked<PrestamoService>;

  const mockPrestamoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestamoController],
      providers: [
        {
          provide: PrestamoService,
          useValue: mockPrestamoService,
        },
      ],
    }).compile();

    controller = module.get<PrestamoController>(PrestamoController);
    service = module.get(PrestamoService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPrestamoDto: CreatePrestamoDto = {
      isbn: '978-0-123456-78-9',
      identificacionUsuario: '1234567890',
    };

    it('debe crear un préstamo exitosamente', async () => {
      // Arrange
      const mockResponse = new PrestamoResponseDto({
        id: '550e8400-e29b-41d4-a716-446655440000',
        isbn: createPrestamoDto.isbn,
        identificacionUsuario: createPrestamoDto.identificacionUsuario,
        fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
        fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
        libro: { nombre: 'El Quijote' },
      });

      mockPrestamoService.create.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.create(createPrestamoDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createPrestamoDto);
      expect(result).toEqual(mockResponse);
      expect(result.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('debe lanzar BadRequestException cuando el usuario invitado ya tiene un préstamo', async () => {
      // Arrange
      mockPrestamoService.create.mockRejectedValue(
        new BadRequestException('El usuario ya tiene un libro prestado'),
      );

      // Act & Assert
      await expect(controller.create(createPrestamoDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.create(createPrestamoDto)).rejects.toThrow(
        'El usuario ya tiene un libro prestado',
      );
    });

    it('debe lanzar NotFoundException cuando el usuario no existe', async () => {
      // Arrange
      mockPrestamoService.create.mockRejectedValue(
        new NotFoundException('Usuario no encontrado.'),
      );

      // Act & Assert
      await expect(controller.create(createPrestamoDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.create(createPrestamoDto)).rejects.toThrow(
        'Usuario no encontrado.',
      );
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los préstamos', async () => {
      // Arrange
      const mockPrestamos = [
        new PrestamoResponseDto({
          id: '550e8400-e29b-41d4-a716-446655440000',
          isbn: '978-0-123456-78-9',
          identificacionUsuario: '1234567890',
          fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
          fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
          libro: { nombre: 'El Quijote' },
        }),
        new PrestamoResponseDto({
          id: '660e8400-e29b-41d4-a716-446655440001',
          isbn: '978-0-987654-32-1',
          identificacionUsuario: '2345678901',
          fechaPrestamo: new Date('2024-01-16T10:00:00Z'),
          fechaMaximaDevolucion: new Date('2024-01-24T10:00:00Z'),
          libro: { nombre: 'Cien años de soledad' },
        }),
      ];

      mockPrestamoService.findAll.mockResolvedValue(mockPrestamos);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPrestamos);
      expect(result).toHaveLength(2);
    });

    it('debe retornar un array vacío cuando no hay préstamos', async () => {
      // Arrange
      mockPrestamoService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un préstamo por ID', async () => {
      // Arrange
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const mockPrestamo = new PrestamoResponseDto({
        id,
        isbn: '978-0-123456-78-9',
        identificacionUsuario: '1234567890',
        fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
        fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
        libro: { nombre: 'El Quijote' },
      });

      mockPrestamoService.findOne.mockResolvedValue(mockPrestamo);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockPrestamo);
      expect(result.id).toBe(id);
    });

    it('debe lanzar NotFoundException cuando el préstamo no existe', async () => {
      // Arrange
      const id = 'id-inexistente';
      mockPrestamoService.findOne.mockRejectedValue(
        new NotFoundException('El préstamo no existe'),
      );

      // Act & Assert
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(controller.findOne(id)).rejects.toThrow(
        'El préstamo no existe',
      );
    });

    it('debe verificar que el préstamo retornado tiene todos los campos', async () => {
      // Arrange
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const mockPrestamo = new PrestamoResponseDto({
        id,
        isbn: '978-0-123456-78-9',
        identificacionUsuario: '1234567890',
        fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
        fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
        libro: { nombre: 'El Quijote' },
      });

      mockPrestamoService.findOne.mockResolvedValue(mockPrestamo);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('isbn');
      expect(result).toHaveProperty('identificacionUsuario');
      expect(result).toHaveProperty('fechaMaximaDevolucion');
      expect(result).toHaveProperty('nombreLibro');
    });
  });
});
