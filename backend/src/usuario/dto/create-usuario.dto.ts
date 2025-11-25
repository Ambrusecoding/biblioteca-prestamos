import { IsNotEmpty, IsString, IsInt, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_TYPES } from '../../models/user.models';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Identificación única del usuario (máximo 10 caracteres)',
    example: '1234567890',
    maxLength: 10,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10, {
    message: 'La identificación del usuario no puede tener más de 10 caracteres.',
  })
  identificacionUsuario: string;

  @ApiProperty({
    description: 'Tipo de usuario: 1=Afiliado, 2=Empleado, 3=Invitado',
    example: 1,
    enum: [1, 2, 3],
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Max(3)
  tipoUsuario: number;
}

