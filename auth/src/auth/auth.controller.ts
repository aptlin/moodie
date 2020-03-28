import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Ip,
  Logger,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExtractJwt } from 'passport-jwt';
import { RegisterUserDTO, UserDTO } from 'src/auth/DTO/users';
import { User } from 'src/shared/decorators';
import { enumToArray, getOperationId, validateDTO } from 'src/shared/utils';
import { GrantType } from './auth.interface';
import { AuthService } from './auth.service';
import { LoginDTO, LoginResponseDTO } from './DTO/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokensService } from './tokens/tokens.service';
import { UsersService } from './users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger('User');
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly userService: UsersService,
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
  ): Promise<LoginResponseDTO> {
    let res: LoginResponseDTO;

    switch (grantType) {
      case GrantType.RefreshToken:
        try {
          const oldAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          res = await this.tokensService.getAccessTokenFromRefreshToken(
            refreshToken,
            oldAccessToken,
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

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDTO })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiOperation(getOperationId('User', 'Register'))
  async registerClient(@Body() registerDTO: RegisterUserDTO): Promise<UserDTO> {
    const errors = await validateDTO(RegisterUserDTO, registerDTO);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { email } = registerDTO;

    let exist;
    try {
      exist = await this.userService.findOneByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException('Error while creating a user');
    }

    if (exist) {
      throw new BadRequestException(
        `The user with email ${email} already exists`,
      );
    }

    const newUser = await this.userService.register(registerDTO);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, firstName, lastName, birthDate } = newUser;
    return { email, username, firstName, lastName, birthDate };
  }
}
