import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';

@ApiTags('usuarios')
@Controller('api/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description:
      'Retorna una lista de todos los usuarios registrados en el sistema, ordenados por identificación.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          identificacionUsuario: {
            type: 'string',
            example: '1234567890',
            description: 'Identificación única del usuario',
          },
          tipoUsuario: {
            type: 'number',
            enum: [1, 2, 3],
            example: 1,
            description: 'Tipo de usuario: 1=Afiliado, 2=Empleado, 3=Invitado',
          },
        },
      },
    },
  })
  async findAll() {
    return this.usuarioService.findAll();
  }
}
