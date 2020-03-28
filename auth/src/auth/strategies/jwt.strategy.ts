import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokensService } from '../tokens/tokens.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tokensService: TokensService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('access_token'),
      ]),
      secretOrKey: configService.get<string>('auth.secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const result = await this.tokensService.validatePayload(payload);
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
}
