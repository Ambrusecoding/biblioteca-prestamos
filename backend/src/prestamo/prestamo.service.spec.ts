/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { PrestamoRepository } from './prestamo.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { DateUtilsService } from '../utils/date-utils.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { USER_TYPES } from '../models/user.models';
import { PrestamoResponseDto } from './dto/prestamo-response.dto';

describe('PrestamoService', () => {
  let service: PrestamoService;
  let prestamoRepository: jest.Mocked<PrestamoRepository>;
  let usuarioRepository: jest.Mocked<UsuarioRepository>;
  let dateUtilsService: jest.Mocked<DateUtilsService>;

  const mockPrestamoRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    countActiveLoansByUser: jest.fn(),
  };

  const mockUsuarioRepository = {
    findTipoUsuario: jest.fn(),
  };

  const mockDateUtilsService = {
    calculateReturnDate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestamoService,
        {
          provide: PrestamoRepository,
          useValue: mockPrestamoRepository,
        },
        {
          provide: UsuarioRepository,
          useValue: mockUsuarioRepository,
        },
        {
          provide: DateUtilsService,
          useValue: mockDateUtilsService,
        },
      ],
    }).compile();

    service = module.get<PrestamoService>(PrestamoService);
    prestamoRepository = module.get(PrestamoRepository);
    usuarioRepository = module.get(UsuarioRepository);
    dateUtilsService = module.get(DateUtilsService);

    // Resetear mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createPrestamoDto: CreatePrestamoDto = {
      isbn: '978-0-123456-78-9',
      identificacionUsuario: '1234567890',
    };

    const mockPrestamo = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      isbn: createPrestamoDto.isbn,
      identificacionUsuario: createPrestamoDto.identificacionUsuario,
      fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
      fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
      libro: {
        nombre: 'El Quijote',
      },
    };

    it('debe crear un préstamo exitosamente para usuario afiliado', async () => {
      // Arrange
      const tipoUsuario = USER_TYPES.AFILIADO;
      const fechaDevolucion = new Date('2024-01-25T10:00:00Z');

      usuarioRepository.findTipoUsuario.mockResolvedValue(tipoUsuario);
      dateUtilsService.calculateReturnDate.mockReturnValue(fechaDevolucion);
      prestamoRepository.save.mockResolvedValue(mockPrestamo as any);

      // Act
      const result = await service.create(createPrestamoDto);

      // Assert
      expect(usuarioRepository.findTipoUsuario).toHaveBeenCalledWith(
        createPrestamoDto.identificacionUsuario,
      );
      expect(dateUtilsService.calculateReturnDate).toHaveBeenCalledWith(
        tipoUsuario,
      );
      expect(prestamoRepository.save).toHaveBeenCalled();
      const saveCallArgs = (
        prestamoRepository.save as jest.MockedFunction<
          PrestamoRepository['save']
        >
      ).mock.calls[0]?.[0];
      expect(saveCallArgs).toMatchObject({
        isbn: createPrestamoDto.isbn,
        identificacionUsuario: createPrestamoDto.identificacionUsuario,
        fechaMaximaDevolucion: fechaDevolucion,
      });
      expect(saveCallArgs?.fechaPrestamo).toBeInstanceOf(Date);
      expect(result instanceof PrestamoResponseDto).toBe(true);
      expect(result.id).toBe(mockPrestamo.id);
    });

    it('debe crear un préstamo exitosamente para usuario empleado', async () => {
      // Arrange
      const tipoUsuario = USER_TYPES.EMPLEADO;
      const fechaDevolucion = new Date('2024-01-23T10:00:00Z');

      usuarioRepository.findTipoUsuario.mockResolvedValue(tipoUsuario);
      dateUtilsService.calculateReturnDate.mockReturnValue(fechaDevolucion);
      prestamoRepository.save.mockResolvedValue(mockPrestamo as any);

      // Act
      const result = await service.create(createPrestamoDto);

      // Assert
      expect(usuarioRepository.findTipoUsuario).toHaveBeenCalled();
      expect(dateUtilsService.calculateReturnDate).toHaveBeenCalledWith(
        tipoUsuario,
      );
      expect(result instanceof PrestamoResponseDto).toBe(true);
    });

    it('debe crear un préstamo exitosamente para usuario invitado sin préstamos previos', async () => {
      // Arrange
      const tipoUsuario = USER_TYPES.INVITADO;
      const fechaDevolucion = new Date('2024-01-22T10:00:00Z');

      usuarioRepository.findTipoUsuario.mockResolvedValue(tipoUsuario);
      prestamoRepository.countActiveLoansByUser.mockResolvedValue(0);
      dateUtilsService.calculateReturnDate.mockReturnValue(fechaDevolucion);
      prestamoRepository.save.mockResolvedValue(mockPrestamo as any);

      // Act
      const result = await service.create(createPrestamoDto);

      // Assert
      expect(prestamoRepository.countActiveLoansByUser).toHaveBeenCalledWith(
        createPrestamoDto.identificacionUsuario,
      );
      expect(result instanceof PrestamoResponseDto).toBe(true);
    });

    it('debe lanzar BadRequestException cuando usuario invitado ya tiene un préstamo', async () => {
      // Arrange
      const tipoUsuario = USER_TYPES.INVITADO;

      usuarioRepository.findTipoUsuario.mockResolvedValue(tipoUsuario);
      prestamoRepository.countActiveLoansByUser.mockResolvedValue(1);

      // Act & Assert
      await expect(service.create(createPrestamoDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createPrestamoDto)).rejects.toThrow(
        'El usuario ya tiene un libro prestado',
      );
      expect(prestamoRepository.save).not.toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException cuando el usuario no existe', async () => {
      // Arrange
      usuarioRepository.findTipoUsuario.mockRejectedValue(
        new NotFoundException('Usuario no encontrado.'),
      );

      // Act & Assert
      await expect(service.create(createPrestamoDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prestamoRepository.save).not.toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException para errores al validar usuario', async () => {
      // Arrange
      usuarioRepository.findTipoUsuario.mockRejectedValue(
        new Error('Error de base de datos'),
      );

      // Act & Assert
      await expect(service.create(createPrestamoDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createPrestamoDto)).rejects.toThrow(
        'Error al validar el usuario.',
      );
    });
  });

  describe('findOne', () => {
    const mockPrestamo = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      isbn: '978-0-123456-78-9',
      identificacionUsuario: '1234567890',
      fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
      fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
      libro: {
        nombre: 'El Quijote',
      },
    };

    it('debe retornar un préstamo por ID', async () => {
      // Arrange
      const id = '550e8400-e29b-41d4-a716-446655440000';
      prestamoRepository.findById.mockResolvedValue(mockPrestamo as any);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(prestamoRepository.findById).toHaveBeenCalledWith(id);
      expect(result instanceof PrestamoResponseDto).toBe(true);
      expect(result.id).toBe(id);
    });

    it('debe lanzar NotFoundException cuando el préstamo no existe', async () => {
      // Arrange
      const id = 'id-inexistente';
      prestamoRepository.findById.mockRejectedValue(
        new NotFoundException('El préstamo no existe'),
      );

      // Act & Assert
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow(
        'El préstamo no existe',
      );
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los préstamos', async () => {
      // Arrange
      const mockPrestamos = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          isbn: '978-0-123456-78-9',
          identificacionUsuario: '1234567890',
          fechaPrestamo: new Date('2024-01-15T10:00:00Z'),
          fechaMaximaDevolucion: new Date('2024-01-25T10:00:00Z'),
          libro: { nombre: 'El Quijote' },
          usuario: {
            identificacionUsuario: '1234567890',
            tipoUsuario: USER_TYPES.AFILIADO,
          },
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          isbn: '978-0-987654-32-1',
          identificacionUsuario: '0987654321',
          fechaPrestamo: new Date('2024-01-16T10:00:00Z'),
          fechaMaximaDevolucion: new Date('2024-01-26T10:00:00Z'),
          libro: { nombre: 'Cien años de soledad' },
          usuario: {
            identificacionUsuario: '0987654321',
            tipoUsuario: USER_TYPES.EMPLEADO,
          },
        },
      ];

      prestamoRepository.findAll.mockResolvedValue(mockPrestamos as any);

      // Act
      const result = await service.findAll();

      // Assert
      expect(prestamoRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0] instanceof PrestamoResponseDto).toBe(true);
      expect(result[1] instanceof PrestamoResponseDto).toBe(true);
    });

    it('debe retornar array vacío cuando no hay préstamos', async () => {
      // Arrange
      prestamoRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
