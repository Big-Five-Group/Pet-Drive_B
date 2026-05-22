import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, ParseIntPipe, Query} from '@nestjs/common';
import { ViagemService } from '../services/viagem.service';
import { Viagem } from '../entities/viagem.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateViagemDto, UpdateViagemDto } from '../dto/viagem.dto';

@ApiTags('Viagens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/viagens')

export class ViagemController {
  constructor(private readonly viagemService: ViagemService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Viagem[]> {
    return await this.viagemService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Viagem> {
    return await this.viagemService.findById(id);
  }

  @Get('/destino/:destino')
  @HttpCode(HttpStatus.OK)
  async findByDestino(@Param('destino') destino: string): Promise<Viagem[]> {
    return await this.viagemService.findByDestino(destino);
  }

  @Post()
  create(@Body() viagem: CreateViagemDto): Promise<Viagem> {
    return this.viagemService.create(viagem);
  }

  @Put('/:id')
  update(@Param('id', ParseIntPipe) id: number,
  @Body() viagem: UpdateViagemDto,
  ): Promise<Viagem> {
    return this.viagemService.update(id, viagem);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.viagemService.delete(id);
  }

  // ENDPOINT ESPECIAL DO DESAFIO
  @Get('/calcular/tempo')
  @HttpCode(HttpStatus.OK)
  calcularTempo(
    @Query('distancia', ParseIntPipe)
    distancia: number,

    @Query('velocidade', ParseIntPipe)
    velocidade: number,
  ): { tempoEstimado: string } {
    const tempoEstimado = this.viagemService.calcularTempoEstimado(
      distancia,
      velocidade,
    );

    return { tempoEstimado };
  }
}
