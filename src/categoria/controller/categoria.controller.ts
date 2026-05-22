import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete, UseGuards, HttpStatus, HttpCode} from '@nestjs/common';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../entities/categoria.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dto/categoria.dto';

@ApiTags('Categoria')
@UseGuards(JwtAuthGuard)
@Controller('/categorias')
@ApiBearerAuth()
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @Get('/:id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return this.categoriaService.findById(id);
  }

  @Get('/descricao/:descricao')
  findByDescricao(@Param('nome') nome: string): Promise<Categoria[]> {
    return this.categoriaService.findByDescricao(nome);
  }

  @Post()
  create(@Body() categoria: CreateCategoriaDto): Promise<Categoria> {
    return this.categoriaService.create(categoria);
  }

@Put()
  update(@Body() categoria: UpdateCategoriaDto): Promise<Categoria> {
    return this.categoriaService.update(categoria);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.delete(id);
  }
}
