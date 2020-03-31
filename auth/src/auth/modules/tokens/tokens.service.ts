import { getUnixTime } from 'date-fns';
import { add } from 'date-fns';
import { randomBytes } from 'crypto';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { RefreshToken } from './tokens.interface';
import { JWTPayload } from '../../auth.interface';
import { v4 as uuid } from 'uuid';
import { CreateTokenDTO, LoginResponseDTO } from '../../DTO/auth';

@Injectable()
export class TokensService {
  private readonly logger = new Logger('Tokens Service');
  private refreshTokenExpiration: number;
  private accessTokenExpiration: number;

  //TODO: move the cache to Redis
  private readonly usersExpired: { [id: string]: number } = {};

  constructor(
    @InjectModel('Tokens')
    private tokensModel: Model<RefreshToken & mongoose.Document>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.accessTokenExpiration = this.configService.get<number>(
      'auth.accessTokenExpiration',
    );
    this.refreshTokenExpiration = this.configService.get<number>(
      'auth.refreshTokenExpiration',
    );
  }
  async findOne(refreshTokenValue: string, sessionId?: string) {
    return this.tokensModel.findOne({
      value: refreshTokenValue,
      expiresAt: { $gte: new Date() },
      sessionId,
    });
  }

  async create(createTokenDTO: CreateTokenDTO) {
    const createdToken = new this.tokensModel(createTokenDTO);
    return await createdToken.save();
  }

  async delete(filter = {}) {
    return this.tokensModel.deleteMany(filter);
  }

  async getAccessTokenFromRefreshToken(
    refreshToken: string,
    oldAccessToken: string,
    sessionId: string,
    ipAddress: string,
  ): Promise<LoginResponseDTO> {
    try {
      const token = await this.findOne(refreshToken, sessionId);
      const currentDate = new Date();
      if (!token) {
        throw new InternalServerErrorException('Refresh token not found');
      }
      if (token.expiresAt < currentDate) {
        throw new BadRequestException('Refresh token expired');
      }
      const oldPayload = await this.validateToken(oldAccessToken, true);
      const payload = { sub: oldPayload.sub };
      const accessToken = await this.createAccessToken(payload);

      await token.remove();

      accessToken.refreshToken = await this.createRefreshToken({
        userId: oldPayload.sub,
        sessionId,
        ipAddress,
      });
      return accessToken;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async createRefreshToken(tokenContent: {
    userId: string;
    ipAddress: string;
    sessionId: string;
  }) {
    const { userId, ipAddress, sessionId } = tokenContent;

    const token: RefreshToken = {
      userId: userId,
      value: randomBytes(64).toString('hex'),
      ipAddress,
      sessionId,
      expiresAt: add(new Date(), { seconds: this.refreshTokenExpiration }),
    };

    await this.create(token);

    return token.value;
  }

  createAccessToken(payload: JWTPayload) {
    const options = { jwtid: uuid() };
    const signedPayload = this.jwtService.sign(payload, options);
    const token: LoginResponseDTO = {
      accessToken: signedPayload,
      expiresIn: this.accessTokenExpiration,
    };
    return token;
  }

  async validateToken(token: string, ignoreExpiration = false) {
    return (await this.jwtService.verifyAsync(token, {
      ignoreExpiration,
    })) as JWTPayload;
  }

  async deleteRefreshTokenForUser(userId: string) {
    await this.delete({ userId });
    await this.revokeTokenForUser(userId);
  }

  async deleteRefreshToken(userId: string, value: string) {
    await this.delete({ value });
    await this.revokeTokenForUser(userId);
  }

  async validatePayload(payload: JWTPayload) {
    const tokenBlacklisted = await this.isBlackListed(payload.sub, payload.exp);
    if (!tokenBlacklisted) {
      return {
        id: payload.sub,
      };
    }
    return null;
  }

  private async isBlackListed(id: string, expire: number): Promise<boolean> {
    return this.usersExpired[id] && expire < this.usersExpired[id];
  }

  private async revokeTokenForUser(userId: string): Promise<any> {
    this.usersExpired[userId] = getUnixTime(
      add(new Date(), { seconds: this.accessTokenExpiration }),
    );
  }
}
