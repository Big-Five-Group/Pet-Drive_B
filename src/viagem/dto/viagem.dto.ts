import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, Length, Matches} from 'class-validator';
import { ApiProperty, PartialType} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateViagemDto {

  @ApiProperty({
    example: 'São Paulo',
  })
  @IsNotEmpty()
  @Length(2, 100)
  origem!: string;

  @ApiProperty({
    example: 'Rio de Janeiro',
  })
  @IsNotEmpty()
  @Length(2, 100)
  destino!: string;

  @ApiProperty({
    example: '22-05-2026',
  })
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'A data deve estar no formato DD-MM-AAAA',
  })
  dataViagem!: string;

  @ApiProperty({
    example: 450,
  })
  @IsNumber()
  @IsPositive()
  distanciaKm!: number;

  @ApiProperty({
    example: 90,
  })
  @IsNumber()
  @IsPositive()
  velocidadeMediaKmh!: number;

  @ApiProperty({
  example: 150,
  })
  @IsNumber()
  valor!: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  categoriaId!: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  usuarioId!: number;
  }

  export class UpdateViagemDto
    extends PartialType(CreateViagemDto) {}