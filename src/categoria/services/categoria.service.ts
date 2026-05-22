import { HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dto/categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async findById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOneBy({ id });

    if (!categoria) {
      throw new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND);
    }
    return categoria;
  }

  async findByDescricao(descricao: string): Promise<Categoria[]> {
    return this.categoriaRepository.find({
      where: {
        descricao: ILike(`%${descricao}%`),
      },
    });
  }

  async create(categoriaDto: CreateCategoriaDto): Promise<Categoria> {
    return await this.categoriaRepository.save(categoriaDto);
  }

  async update(categoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    if (!categoriaDto.id) {
      throw new HttpException('ID é obrigatório', HttpStatus.BAD_REQUEST);
    }
    const existente = await this.findById(categoriaDto.id);

    return this.categoriaRepository.save({
      ...existente,
      ...categoriaDto,
    });
  }

  async delete(id: number) {
    const categoria = await this.findById(id);

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada!');
    }
    return await this.categoriaRepository.delete(id);
  }
}
