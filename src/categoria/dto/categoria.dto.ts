import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCategoriaDto {

  @ApiProperty({
    example: 'Viagem Internacional',
  })
  @IsNotEmpty()
  @Length(3, 100)
  descricao!: string;
}

export class UpdateCategoriaDto
  extends PartialType(CreateCategoriaDto) {
    @ApiProperty()
    @IsNumber()
    id!: number;
  }