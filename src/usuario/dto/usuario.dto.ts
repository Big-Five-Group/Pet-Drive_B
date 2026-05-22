import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUsuarioDto {
  
  @ApiProperty({
    example: 'Maria Silva',
  })
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({
    example: 'maria@email.com',
  })
  @IsEmail()
  usuario!: string;

  @ApiProperty()
  @IsOptional()
  foto?: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsNotEmpty()
  @MinLength(8)
  senha!: string;

  @IsNotEmpty()
  nomePet!: string;

  @IsNotEmpty()
  raca!: string;

  @IsNotEmpty()
  porte!: string;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
