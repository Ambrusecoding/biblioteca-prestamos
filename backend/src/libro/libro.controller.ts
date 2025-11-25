import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LibroService } from './libro.service';

@ApiTags('libros')
@Controller('api/libro')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los libros',
    description:
      'Retorna una lista de todos los libros disponibles en la biblioteca, ordenados por nombre.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de libros obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          isbn: {
            type: 'string',
            example: '978-0-123456-78-9',
            description: 'ISBN único del libro',
          },
          nombre: {
            type: 'string',
            example: 'El Quijote de la Mancha',
            description: 'Nombre del libro',
          },
        },
      },
    },
  })
  async findAll() {
    return this.libroService.findAll();
  }
}
