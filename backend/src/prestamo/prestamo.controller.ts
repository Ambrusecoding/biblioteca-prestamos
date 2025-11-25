import { Controller, Post, Body, Param, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PrestamoService } from './prestamo.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { PrestamoResponseDto } from './dto/prestamo-response.dto';

@ApiTags('prestamos')
@Controller('api/prestamo')
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo préstamo',
    description:
      'Crea un nuevo préstamo de libro. Valida que el usuario existe y aplica las reglas de negocio (por ejemplo, usuarios invitados solo pueden tener 1 préstamo activo).',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Préstamo creado exitosamente',
    type: PrestamoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o usuario invitado con préstamo activo',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario o libro no encontrado',
  })
  async create(
    @Body() createPrestamoDto: CreatePrestamoDto,
  ): Promise<PrestamoResponseDto> {
    return this.prestamoService.create(createPrestamoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los préstamos',
    description:
      'Retorna una lista de todos los préstamos registrados en el sistema, ordenados por fecha de préstamo (más recientes primero).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de préstamos obtenida exitosamente',
    type: [PrestamoResponseDto],
  })
  async findAll(): Promise<PrestamoResponseDto[]> {
    return this.prestamoService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un préstamo por ID',
    description:
      'Retorna la información detallada de un préstamo específico mediante su ID único.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del préstamo',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Préstamo encontrado',
    type: PrestamoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Préstamo no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<PrestamoResponseDto> {
    return this.prestamoService.findOne(id);
  }
}
