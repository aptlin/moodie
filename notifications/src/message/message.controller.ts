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
import { AuthGuard } from '@moodie/shared';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
  VerificationNotificationResponseDTO,
  VerificationNotificationDTO,
} from './message.dto';
import { MessageService } from './message.service';

@Controller('notifications')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}


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
  async verify(
    @Body() verificationNotificationDTO: VerificationNotificationDTO,
  ): Promise<VerificationNotificationResponseDTO> {
    return await this.messageService.send(verificationNotificationDTO);
  }
}
