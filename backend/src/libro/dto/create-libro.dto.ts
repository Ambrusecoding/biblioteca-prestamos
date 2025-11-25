import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLibroDto {
  @ApiProperty({
    description: 'ISBN único del libro',
    example: '978-0-123456-78-9',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({
    description: 'Nombre del libro',
    example: 'El Quijote de la Mancha',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

