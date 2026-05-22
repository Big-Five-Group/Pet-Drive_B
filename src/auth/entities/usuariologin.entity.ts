import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UsuarioLogin {
  @ApiProperty()
  @IsNotEmpty()
  public usuario!: string;

  @ApiProperty()
  @IsNotEmpty()
  public senha!: string;
}
