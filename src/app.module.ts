import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViagemModule } from './viagem/viagem.module';
import { DevService } from './auth/data/services/dev.service';
import { ProdService } from './auth/data/services/prod.service';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Env Global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass:
        process.env.NODE_ENV === 'production' ? ProdService : DevService,
    }),

    // Modules
    AuthModule,
    UsuarioModule,
    CategoriaModule,
    ViagemModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
