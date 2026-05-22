import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_viagens' })
export class Viagem {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 250, nullable: false })
  origem!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 250, nullable: false })
  destino!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column('float')
  distanciaKm!: number;

  @ApiProperty()
  @IsNotEmpty()
  @Column('float')
  velocidadeMediaKmh!: number;

  @ApiProperty()
  @IsOptional()
  @Column('float')
  valor!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Column({ type: 'date', nullable: false })
  dataViagem!: Date;

  @ApiProperty()
  @IsOptional()
  @Column({ length: 50, default: 'disponivel' })
  status!: string;

  @ApiProperty()
  @IsOptional()
  @Column('float')
  tempoViagemHoras!: number;

  @ApiProperty({ type: () => Usuario })
  @ManyToOne(() => Usuario, (usuario) => usuario.viagem, {
    onDelete: 'CASCADE',
  })
  usuario!: Usuario;

  @ApiProperty({ type: () => Categoria })
  @ManyToOne(() => Categoria, (categoria) => categoria.viagem, {
    onDelete: 'CASCADE',
  })
  categoria!: Categoria;
}
