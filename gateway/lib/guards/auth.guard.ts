import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly verificationURI: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const authURI = this.configService.get<string>('auth.uri');
    const verificationEndpoint = this.configService.get<string>(
      'auth.verificationEndpoint',
    );
    this.verificationURI = `${authURI}/${verificationEndpoint}`;
  }
  validate(accessToken) {
    return this.httpService
      .post(
        this.verificationURI,
        { accessToken },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .toPromise();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      this.httpService;
      return new Promise<boolean>((resolve, reject) => {
        this.validate(accessToken)
          .then(({ data }) => {
            const { id } = data;
            request.user = id;
            resolve(true);
          })
          .catch(err => {
            if (err) {
              reject(err);
            }
          });
      });
    }
    throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}
