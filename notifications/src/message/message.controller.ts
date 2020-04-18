import {
  Controller,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  Req,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@moodie/gateway';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
  VerificationNotificationResponseDTO,
  VerificationNotificationDTO,
} from './message.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@UseGuards(AuthGuard)
@Controller('notifications')
export class MessageController {
  constructor(
    @InjectQueue('verification') private readonly verificationQueue: Queue,
  ) {}

  @UseGuards(AuthGuard)
  @Post('verify')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: VerificationNotificationResponseDTO,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiOperation({
    summary: 'Create an experience of a given or default theme for a user',
  })
  async create(
    @Body() verificationNotificationDTO: VerificationNotificationDTO,
  ): Promise<VerificationNotificationResponseDTO> {
    return await this.verificationQueue.add(
      'send',
      verificationNotificationDTO,
    );
  }
}
