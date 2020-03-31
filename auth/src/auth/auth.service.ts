import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';
import { JWTPayload } from './auth.interface';
import {
  LoginDTO,
  LoginResponseDTO,
  AccessTokenValidationDTO,
} from './DTO/auth';
import { TokensService } from './modules/tokens/tokens.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}

  async login(
    credentials: LoginDTO,
    ipAddress: string,
  ): Promise<LoginResponseDTO> {
    const { sessionId } = credentials;
    const loginResults = await this.usersService.login(credentials);
    if (!loginResults) {
      return null;
    }

    const payload: JWTPayload = {
      sub: loginResults.id,
    };

    const loginResponse: LoginResponseDTO = await this.tokensService.createAccessToken(
      payload,
    );

    const tokenContent = {
      userId: loginResults.id,
      ipAddress,
      sessionId,
    };
    const refresh = await this.tokensService.createRefreshToken(tokenContent);

    loginResponse.refreshToken = refresh;

    return loginResponse;
  }

  async validate(payload: AccessTokenValidationDTO) {
    const { accessToken } = payload;
    return this.tokensService.validateToken(accessToken, false);
  }

  async logout(userId: string, refreshToken: string): Promise<any> {
    await this.tokensService.deleteRefreshToken(userId, refreshToken);
  }

  async logoutFromAll(userId: string): Promise<any> {
    await this.tokensService.deleteRefreshTokenForUser(userId);
  }
}
