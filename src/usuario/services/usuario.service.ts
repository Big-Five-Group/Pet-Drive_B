import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    private readonly bcrypt: Bcrypt,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: {
        viagem: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: {
        viagem: true,
      },
    });

    if (!usuario) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }
    return usuario;
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const buscaUsuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senha')
      .where('usuario.usuario = :usuario', { usuario: dto.usuario })
      .getOne();

    if (buscaUsuario) {
      throw new HttpException(
        'O Usuário (e-mail) já está cadastrado!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const novoUsuario = this.usuarioRepository.create(dto);

    novoUsuario.senha = await this.bcrypt.criptografarSenha(dto.senha);

    return await this.usuarioRepository.save(novoUsuario);
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findById(id);

    const buscaUsuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senha')
      .where('usuario.usuario = :usuario', { usuario: dto.usuario })
      .getOne();

    if (buscaUsuario && buscaUsuario.id !== id) {
      throw new HttpException('O Usuário (e-mail) já está em uso por outra conta!', HttpStatus.BAD_REQUEST);
    }

    Object.assign(usuario, dto);

    if (dto.senha) {
      usuario.senha = await this.bcrypt.criptografarSenha(dto.senha);
    }
    return await this.usuarioRepository.save(usuario);
  }

  async delete(id: number) {
    await this.findById(id);
    return await this.usuarioRepository.delete(id);
  }

  async findByUsuario(usuario: string): Promise<Usuario | null> {
    return await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senha')
      .where('usuario.usuario = :usuario', { usuario })
      .getOne();
  }
}
