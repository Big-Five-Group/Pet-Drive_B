import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<Usuario, 'senha'> | null> {
    const buscaUsuario = await this.usuarioService.findByUsuario(username);

    if (!buscaUsuario) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    const matchPassword = await this.bcrypt.compararSenhas(
      password,
      buscaUsuario.senha,
    );

    if (matchPassword) {
      const { senha: senhaRemovida, ...resposta } = buscaUsuario;
      void senhaRemovida;
      return resposta;
    }

    return null;
  }

  async login(usuarioLogin: UsuarioLogin) {
    const buscaUsuario = await this.usuarioService.findByUsuario(
      usuarioLogin.usuario,
    );

    if (!buscaUsuario) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    const payload = {
      sub: buscaUsuario.id,
      usuario: buscaUsuario.usuario,
    };

    return {
      id: buscaUsuario.id,
      nome: buscaUsuario.nome,
      usuario: buscaUsuario.usuario,
      foto: buscaUsuario.foto,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
