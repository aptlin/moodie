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
  ApiTags,
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
  GetThemeResponseDTO,
  GetThemeDTO,
  GetExperienceResponseDTO,
  GetExperienceDTO,
} from './DTO/mood';
import { AuthGuard } from './guards/auth.guard';
import { MoodService } from './mood.service';
import { safeJsonParse } from 'src/shared/utils';

@Controller('mood')
@ApiTags('mood')
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
  @Get('theme')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiQuery({ name: 'theme', required: true })
  @ApiQuery({ name: 'experience', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: GetThemeResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async getTheme(
    @Req() req,
    @Query('theme') rawTheme: string,
    @Query('experience') rawExperience?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ): Promise<GetThemeResponseDTO> {
    const theme = safeJsonParse(rawTheme);
    const experience = safeJsonParse(rawExperience);
    const options: GetThemeDTO = {
      theme,
      experience,
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    };
    if (!offset) {
      options.offset = 0;
    }
    if (!limit) {
      options.limit = 20;
    }
    return await this.moodService.getTheme(req.user, options);
  }
  @UseGuards(AuthGuard)
  @Get('experience')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiQuery({ name: 'experience', required: true })
  @ApiQuery({ name: 'theme', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: GetExperienceResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async getExperience(
    @Req() req,
    @Query('experience') rawExperience: string,
    @Query('theme') rawTheme?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ): Promise<GetExperienceResponseDTO> {
    const theme = safeJsonParse(rawTheme);
    const experience = safeJsonParse(rawExperience);
    const options: GetExperienceDTO = {
      theme,
      experience,
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    };
    if (!offset) {
      options.offset = 0;
    }
    if (!limit) {
      options.limit = 20;
    }
    return await this.moodService.getExperience(req.user, options);
  }
}
