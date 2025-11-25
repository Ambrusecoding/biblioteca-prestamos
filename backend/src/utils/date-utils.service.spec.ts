import { Test, TestingModule } from '@nestjs/testing';
import { DateUtilsService } from './date-utils.service';
import { USER_TYPES } from '../models/user.models';

describe('DateUtilsService', () => {
  let service: DateUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateUtilsService],
    }).compile();

    service = module.get<DateUtilsService>(DateUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ===============================================
  // PRUEBAS DE LA LÓGICA DE CÁLCULO DE FECHAS
  // ===============================================

  // Función auxiliar para crear fechas consistentes para las pruebas
  // Nota: Los meses en JS van de 0 (Ene) a 11 (Dic)
  const createDate = (year: number, month: number, day: number) => {
    return new Date(year, month, day, 0, 0, 0, 0);
  };

  // -----------------------------------------------
  // Escenario 1: Afiliado (10 días)
  // -----------------------------------------------
  it('debería calcular 10 días hábiles correctamente, incluyendo un fin de semana', () => {
    // 10 días hábiles
    const tipoUsuario = USER_TYPES.AFILIADO;

    // Fecha de inicio: Lunes, 2025-12-01 (Diciembre, mes 11)
    const startDate = createDate(2025, 11, 1);

    // Simulamos que "hoy" es la fecha de inicio
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => startDate as unknown as Date);

    // Fecha esperada: Lunes, 2025-12-15 (10 días hábiles después:
    // Los días 6 y 7 (Sáb/Dom) y 13 y 14 (Sáb/Dom) son saltados)
    const expectedDate = createDate(2025, 11, 15);

    const result = service.calculateReturnDate(tipoUsuario);

    expect(result.getTime()).toBe(expectedDate.getTime());

    // Limpiar el mock para no afectar otras pruebas
    jest.spyOn(global, 'Date').mockRestore();
  });

  // -----------------------------------------------
  // Escenario 2: Invitado (7 días) - Prueba de fin de semana
  // -----------------------------------------------
  it('debería calcular 7 días hábiles, saltando Sábado y Domingo iniciales', () => {
    // 7 días hábiles
    const tipoUsuario = USER_TYPES.INVITADO;

    // Fecha de inicio: Viernes, 2025-11-28
    const startDate = createDate(2025, 10, 28);

    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => startDate as unknown as Date);

    // Fecha esperada: Lunes 2025-12-08 (El cálculo salta Sáb 29 y Dom 30)
    const expectedDate = createDate(2025, 11, 8);

    const result = service.calculateReturnDate(tipoUsuario);

    expect(result.getTime()).toBe(expectedDate.getTime());

    jest.spyOn(global, 'Date').mockRestore();
  });

  // -----------------------------------------------
  // Escenario 3: Empleado (8 días) - Prueba con cambio de mes
  // -----------------------------------------------
  it('debería calcular 8 días hábiles correctamente, incluyendo el final de mes', () => {
    // 8 días hábiles
    const tipoUsuario = USER_TYPES.EMPLEADO;

    // Fecha de inicio: Miércoles, 2025-11-26
    const startDate = createDate(2025, 10, 26);

    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => startDate as unknown as Date);

    // Fecha esperada: Lunes, 2025-12-08 (Salva Sáb 29 y Dom 30)
    const expectedDate = createDate(2025, 11, 8);

    const result = service.calculateReturnDate(tipoUsuario);

    expect(result.getTime()).toBe(expectedDate.getTime());

    jest.spyOn(global, 'Date').mockRestore();
  });
});
