import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: jest.Mocked<UsuarioService>;

  const mockUsuarioService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get(UsuarioService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todos los usuarios', async () => {
      // Arrange
      const mockUsuarios = [
        { identificacionUsuario: '1234567890', tipoUsuario: 1 },
        { identificacionUsuario: '2345678901', tipoUsuario: 2 },
        { identificacionUsuario: '3456789012', tipoUsuario: 3 },
      ];

      mockUsuarioService.findAll.mockResolvedValue(mockUsuarios);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsuarios);
      expect(result).toHaveLength(3);
    });

    it('debe retornar usuarios con diferentes tipos', async () => {
      // Arrange
      const mockUsuarios = [
        { identificacionUsuario: '1111111111', tipoUsuario: 1 }, // Afiliado
        { identificacionUsuario: '2222222222', tipoUsuario: 2 }, // Empleado
        { identificacionUsuario: '3333333333', tipoUsuario: 3 }, // Invitado
      ];

      mockUsuarioService.findAll.mockResolvedValue(mockUsuarios);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result[0].tipoUsuario).toBe(1);
      expect(result[1].tipoUsuario).toBe(2);
      expect(result[2].tipoUsuario).toBe(3);
    });

    it('debe retornar un array vacío cuando no hay usuarios', async () => {
      // Arrange
      mockUsuarioService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('debe propagar errores del servicio', async () => {
      // Arrange
      const error = new Error('Error al obtener usuarios');
      mockUsuarioService.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findAll()).rejects.toThrow(
        'Error al obtener usuarios',
      );
    });
  });
});
