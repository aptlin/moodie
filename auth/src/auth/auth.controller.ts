import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  Body,
  Ip,
  Get,
  Req,
  Query,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokensService } from './tokens/tokens.service';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { getOperationId, enumToArray } from 'src/shared/utils';
import { LoginResponseDTO } from './tokens/DTO';
import { LoginDTO } from './DTO';
import { GrantType } from './auth.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/shared/decorators';
import { ExtractJwt } from 'passport-jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiOperation(getOperationId('Users', 'Login'))
  async login(
    @Ip() userIp,
    @Body() credentials: LoginDTO,
  ): Promise<LoginResponseDTO> {
    const loginResults = await this.authService.login(credentials, userIp);

    if (!loginResults) {
      throw new UnauthorizedException(
        'This email & password combination was not found',
      );
    }

    return loginResults;
  }

  @Get('access_token')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDTO })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiQuery({ name: 'grant_type', enum: enumToArray(GrantType) })
  @ApiQuery({ name: 'refresh_token', required: false })
  @ApiQuery({ name: 'client_id', required: false })
  @ApiOperation({ summary: 'AccessToken', description: 'Get a refresh token' })
  async token(
    @Req() req,
    @Ip() userIp,
    @Query('grant_type') grantType: GrantType,
    @Query('refresh_token') refreshToken?: string,
    @Query('client_id') clientId?: string,
  ): Promise<LoginResponseDTO> {
    let res: LoginResponseDTO;

    switch (grantType) {
      case GrantType.RefreshToken:
        try {
          const oldAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          res = await this.tokensService.getAccessTokenFromRefreshToken(
            refreshToken,
            oldAccessToken,
            clientId,
            userIp,
          );
        } catch (error) {
          throw new InternalServerErrorException('invalid_grant');
        }

        return res;

      default:
        throw new BadRequestException('invalid_grant');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiOperation(getOperationId('Users', 'Logout'))
  async logout(
    @User('id') userId,
    @Query('refresh_token') refreshToken?: string,
    @Query('from_all') fromAll = false,
  ): Promise<any> {
    if (fromAll) {
      await this.authService.logoutFromAll(userId);
    } else {
      if (!refreshToken) {
        throw new BadRequestException('No refresh token provided');
      }
      await this.authService.logout(refreshToken, userId);
    }
    return { message: 'ok' };
  }
}
