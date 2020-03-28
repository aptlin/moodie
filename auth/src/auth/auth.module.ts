import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/auth/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokensService } from './modules/tokens/tokens.service';
import { TokensModule } from './modules/tokens/tokens.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensSchema } from './modules/tokens/tokens.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: 'Tokens', schema: TokensSchema }]),
    JwtModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get<number>('auth.accessTokenExpiration'),
        },
        secret: configService.get<string>('auth.secret'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TokensModule,
  ],
  providers: [AuthService, TokensService, JwtStrategy],
  exports: [AuthService, TokensService],
  controllers: [AuthController],
})
export class AuthModule {}
