import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JWTPayload } from './auth.interface';
import { LoginDTO } from './DTO';
import { LoginResponseDTO } from './tokens/DTO';
import { TokensService } from './tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}

  async login(
    credentials: LoginDTO,
    ipAddress: string,
  ): Promise<LoginResponseDTO> {
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
      clientId: credentials.clientId,
      ipAddress,
    };
    const refresh = await this.tokensService.createRefreshToken(tokenContent);

    loginResponse.refreshToken = refresh;

    return loginResponse;
  }

  async logout(userId: string, refreshToken: string): Promise<any> {
    await this.tokensService.deleteRefreshToken(userId, refreshToken);
  }

  async logoutFromAll(userId: string): Promise<any> {
    await this.tokensService.deleteRefreshTokenForUser(userId);
  }
}
