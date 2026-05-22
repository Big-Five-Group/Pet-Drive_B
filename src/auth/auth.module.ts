import { forwardRef, Module } from '@nestjs/common';
import { Bcrypt } from './bcrypt/bcrypt';
import { UsuarioModule } from '../usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsuarioModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [Bcrypt, AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [Bcrypt, JwtModule],
})
export class AuthModule {}
