import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Viagem } from '../../viagem/entities/viagem.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @IsNotEmpty()
  @Column({ length: 255 })
  @ApiProperty()
  nome!: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({ length: 255, unique: true })
  @ApiProperty({ example: 'email@email.com.br' })
  usuario!: string; // E-mail

  @IsNotEmpty()
  @Column({ length: 255, select: false })
  @ApiProperty()
  senha!: string;

  @IsOptional()
  @Column({ length: 5000, nullable: true })
  @ApiProperty()
  foto!: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  @ApiProperty()
  nomePet!: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  @ApiProperty()
  raca!: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  @ApiProperty()
  porte!: string;

  @ApiProperty({ type: () => Viagem })
  @OneToMany(() => Viagem, (viagem) => viagem.usuario)
  viagem!: Viagem[];
}
