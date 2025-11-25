import { Test, TestingModule } from '@nestjs/testing';
import { LibroController } from './libro.controller';
import { LibroService } from './libro.service';

describe('LibroController', () => {
  let controller: LibroController;
  let service: jest.Mocked<LibroService>;

  const mockLibroService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibroController],
      providers: [
        {
          provide: LibroService,
          useValue: mockLibroService,
        },
      ],
    }).compile();

    controller = module.get<LibroController>(LibroController);
    service = module.get(LibroService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todos los libros', async () => {
      // Arrange
      const mockLibros = [
        { isbn: '978-0-123456-78-9', nombre: 'El Quijote' },
        { isbn: '978-0-987654-32-1', nombre: 'Cien años de soledad' },
      ];

      mockLibroService.findAll.mockResolvedValue(mockLibros);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockLibros);
      expect(result).toHaveLength(2);
    });

    it('debe retornar un array vacío cuando no hay libros', async () => {
      // Arrange
      mockLibroService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('debe propagar errores del servicio', async () => {
      // Arrange
      const error = new Error('Error al obtener libros');
      mockLibroService.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findAll()).rejects.toThrow(
        'Error al obtener libros',
      );
    });
  });
});
