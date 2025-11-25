import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_TYPES } from 'src/models/user.models';

export type TipoUsuario =
  | USER_TYPES.AFILIADO
  | USER_TYPES.EMPLEADO
  | USER_TYPES.INVITADO;

export class CreatePrestamoDto {
  @ApiProperty({
    description: 'ISBN del libro a prestar',
    example: '978-0-123456-78-9',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({
    description: 'Identificación del usuario (máximo 10 caracteres)',
    example: '1234567890',
    maxLength: 10,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10, {
    message:
      'La identificación del usuario no puede tener más de 10 caracteres.',
  })
  identificacionUsuario: string;
}
