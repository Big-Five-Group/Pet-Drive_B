import { IsNotEmpty } from 'class-validator';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Viagem } from '../../viagem/entities/viagem.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  descricao!: string;

  @ApiProperty({ type: () => Viagem })
  @OneToMany(() => Viagem, (viagem) => viagem.categoria)
  viagem!: Viagem[];
}
