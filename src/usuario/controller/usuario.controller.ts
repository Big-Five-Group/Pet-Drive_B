import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, ParseIntPipe, UseGuards, NotFoundException} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/usuario.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('Usuários')
@Controller('/usuarios')
@ApiBearerAuth()
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const usuarios = await this.service.findAll();
    return usuarios.map(({ senha, ...rest }) => rest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const usuario = await this.service.findById(id);
    if (!usuario) {
    throw new NotFoundException('Usuário não encontrado');
  }
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUsuarioDto) {
    const usuario = await this.service.create(dto);
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    const usuario = await this.service.update(id, dto);
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.delete(id);
  }
}
