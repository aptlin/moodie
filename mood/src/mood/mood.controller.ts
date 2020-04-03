import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpService,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ExtractJwt } from 'passport-jwt';
import { CreateDTO, UpdateDTO } from './DTO/mood';
import { MoodService } from './mood.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';

@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: CreateDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async create(@Req() req, @Body() createDTO: CreateDTO) {
    return await this.moodService.createExperience(req.user, createDTO);
  }
  @UseGuards(AuthGuard)
  @Post('update')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UpdateDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async update(@Req() req, @Body() updateDTO: UpdateDTO) {
    return await this.moodService.updateExperience(req.user, updateDTO);
  }
}
