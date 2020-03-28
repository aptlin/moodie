import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensSchema } from './tokens.schema';
import { TokensService } from './tokens.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tokens', schema: TokensSchema }]),
    ConfigModule,
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
  ],
  providers: [TokensService],
  controllers: [],
  exports: [TokensService],
})
export class TokensModule {}
