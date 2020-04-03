import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateDTO,
  CreateResponseDTO,
  DeleteExperienceDTO,
  DeleteExperienceResponseDTO,
  DeleteThemeDTO,
  DeleteThemeResponseDTO,
  UpdateExperienceDTO,
  UpdateExperienceResponseDTO,
} from './DTO/mood';
import { AuthGuard } from './guards/auth.guard';
import { MoodService } from './mood.service';

@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: CreateResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiOperation({
    summary: 'Create an experience of a given or default theme for a user',
  })
  async create(
    @Req() req,
    @Body() createDTO: CreateDTO,
  ): Promise<CreateResponseDTO> {
    return await this.moodService.createExperience(req.user, createDTO);
  }

  @UseGuards(AuthGuard)
  @Post('update/experience')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UpdateExperienceResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiOperation({
    summary: 'Create an experience of a given or default theme for a user',
  })
  async update(
    @Req() req,
    @Body() updateExperienceDTO: UpdateExperienceDTO,
  ): Promise<UpdateExperienceResponseDTO> {
    return await this.moodService.updateExperience(
      req.user,
      updateExperienceDTO,
    );
  }

  @UseGuards(AuthGuard)
  @Post('delete/experience')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: DeleteExperienceResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async deleteExperience(
    @Req() req,
    @Body() deleteExperienceDTO: DeleteExperienceDTO,
  ): Promise<DeleteExperienceResponseDTO> {
    return await this.moodService.deleteExperience(
      req.user,
      deleteExperienceDTO,
    );
  }

  @UseGuards(AuthGuard)
  @Post('delete/theme')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: DeleteThemeResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async deleteTheme(
    @Req() req,
    @Body() deleteThemeDTO: DeleteThemeDTO,
  ): Promise<DeleteThemeResponseDTO> {
    return await this.moodService.deleteTheme(req.user, deleteThemeDTO);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiQuery({ name: 'theme', required: false })
  @ApiQuery({ name: 'experience', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: CreateResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async get(
    @Req() req,
    @Query('theme') theme?: string,
    @Query('experience') experience?: string,
  ) {
    // return await this.moodService.createExperience(req.user, createDTO);
  }
}
