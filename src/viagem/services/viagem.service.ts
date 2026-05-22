import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Viagem } from '../entities/viagem.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import { CreateViagemDto, UpdateViagemDto } from '../dto/viagem.dto';

@Injectable()
export class ViagemService {
  constructor(
    @InjectRepository(Viagem)
    private viagemRepository: Repository<Viagem>,
  ) {}

  async findAll(): Promise<Viagem[]> {
    return await this.viagemRepository.find({
      relations: {
        categoria: true,
        usuario: true,
      },
    });
  }

  async findById(id: number): Promise<Viagem> {
    const viagem = await this.viagemRepository.findOne({
      where: {
        id,
      },
      relations: {
        categoria: true,
        usuario: true,
      },
    });

    if (!viagem) {
      throw new HttpException('Viagem não encontrada', HttpStatus.NOT_FOUND);
    }
    return viagem;
  }

  async findByDestino(destino: string): Promise<Viagem[]> {
    return await this.viagemRepository.find({
      where: {
        destino: ILike(`%${destino}%`),
      },
      relations: {
        categoria: true,
        usuario: true,
      },
    });
  }

  async create(viagemDto: CreateViagemDto): Promise<Viagem> {

  if (viagemDto.distanciaKm <= 0) {
    throw new HttpException('A distância deve ser maior que zero', HttpStatus.BAD_REQUEST);
  }

  if (viagemDto.velocidadeMediaKmh <= 0) {
    throw new HttpException('A velocidade média deve ser maior que zero', HttpStatus.BAD_REQUEST);
  }

  const tempoHoras =
    viagemDto.distanciaKm /
    viagemDto.velocidadeMediaKmh;

  const [dia, mes, ano] =
  viagemDto.dataViagem.split('-');

  const dataFormatada = new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia),
  );

  const viagem = this.viagemRepository.create({

    origem: viagemDto.origem,
    destino: viagemDto.destino,
    dataViagem: dataFormatada,
    distanciaKm: viagemDto.distanciaKm,
    velocidadeMediaKmh: viagemDto.velocidadeMediaKmh,
    tempoViagemHoras: Number(tempoHoras.toFixed(2)),
    valor: viagemDto.valor,
    categoria: {
      id: viagemDto.categoriaId,
    } as any,
    usuario: {
      id: viagemDto.usuarioId,
    } as any,
  });

  return await this.viagemRepository.save(viagem);
}

  async update(id: number, viagemDto: UpdateViagemDto): Promise<Viagem> {

  const viagemExistente =
    await this.viagemRepository.findOne({
      where: { id },
      relations: {
        categoria: true,
        usuario: true,
      },
    });

  if (!viagemExistente) {
    throw new HttpException('Viagem não encontrada', HttpStatus.NOT_FOUND);
  }

  if (
    viagemDto.distanciaKm &&
    viagemDto.distanciaKm <= 0
  ) {
    throw new HttpException('A distância deve ser maior que zero', HttpStatus.BAD_REQUEST);
  }

  if (
    viagemDto.velocidadeMediaKmh &&
    viagemDto.velocidadeMediaKmh <= 0
  ) {
    throw new HttpException('A velocidade média deve ser maior que zero', HttpStatus.BAD_REQUEST);
  }

  const distancia =
    viagemDto.distanciaKm ??
    viagemExistente.distanciaKm;

  const velocidade =
    viagemDto.velocidadeMediaKmh ??
    viagemExistente.velocidadeMediaKmh;

  const tempoHoras = distancia / velocidade;

  let dataFormatada: Date | undefined;

  if (viagemDto.dataViagem) {

    const [dia, mes, ano] =
      viagemDto.dataViagem.split('-');

    dataFormatada = new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia),
    );
  }

  const viagem = this.viagemRepository.create({

    ...viagemExistente,

    origem:
      viagemDto.origem ??
      viagemExistente.origem,

    destino:
      viagemDto.destino ??
      viagemExistente.destino,

    dataViagem:
      dataFormatada ??
      viagemExistente.dataViagem,

    distanciaKm: distancia,

    velocidadeMediaKmh: velocidade,

    tempoViagemHoras:
      Number(tempoHoras.toFixed(2)),

    categoria: viagemDto.categoriaId
      ? { id: viagemDto.categoriaId } as any
      : viagemExistente.categoria,

    usuario: viagemDto.usuarioId
      ? { id: viagemDto.usuarioId } as any
      : viagemExistente.usuario,
  });

  return await this.viagemRepository.save(viagem);
  }

  async delete(id: number): Promise<Viagem> {
    const viagemExistente = await this.viagemRepository.findOneBy({ id });

    if (!viagemExistente) {
      throw new HttpException('Viagem não encontrada', HttpStatus.NOT_FOUND);
    }

    await this.viagemRepository.delete(id);
    return viagemExistente;
  }

  calcularTempoEstimado(distancia: number, velocidade: number): string {

    if (velocidade <= 0) {
      throw new HttpException('Velocidade inválida', HttpStatus.BAD_REQUEST);
    }

    const tempoDecimal = distancia / velocidade;
    const totalMinutos = Math.round(tempoDecimal * 60);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    if (horas === 0) {
      return `${minutos} minutos`;
    }

    if (minutos === 0) {
      return `${horas} horas`;
    }

    return `${horas} horas e ${minutos} minutos`;
  }
}
