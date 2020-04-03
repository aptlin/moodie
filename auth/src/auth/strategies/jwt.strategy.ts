import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensService } from '../modules/tokens/tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tokensService: TokensService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
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
