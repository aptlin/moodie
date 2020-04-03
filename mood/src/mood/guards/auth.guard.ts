import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
  HttpService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      const authURI = this.configService.get<string>('auth.uri');
      const verificationEndpoint = this.configService.get<string>(
        'auth.verificationEndpoint',
      );
      const verificationURI = `${authURI}/${verificationEndpoint}`;
      try {
        const { data } = await this.httpService
          .post(
            verificationURI,
            { accessToken },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            },
          )
          .toPromise();
        request.user = data.id;
      } catch (err) {
        throw new HttpException(err.response, HttpStatus.UNAUTHORIZED);
      }
      return true;
    }
    throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}
