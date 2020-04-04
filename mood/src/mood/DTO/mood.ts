import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { PaginatedTheme, Experience } from '../mood.interface';

export class CreateDTO {
  @ApiPropertyOptional({ default: 'Default', example: 'Positivity' })
  theme?: string = 'Default';
  @ApiProperty({ example: 'happiness', required: true }) experience:
    | string
    | string[];
  @ApiPropertyOptional({ default: true, example: true }) isFavorite? = true;
}

export class CreateResponseDTO {
  @ApiResponseProperty() total: number;
  @ApiResponseProperty() created: number;
  @ApiResponseProperty() updated: number;
}

export class UpdateExperienceDTO {
  @ApiProperty({ example: 'happiness', required: true }) experience:
    | string
    | string[];
  @ApiPropertyOptional({ default: false, example: false }) isFavorite? = false;
  @ApiPropertyOptional({ default: false, example: 'Happiness' })
  name?: string | string[] = 'Happiness';
}

export class UpdateExperienceResponseDTO {
  @ApiResponseProperty() total: number;
  @ApiResponseProperty() updated: number;
}

export class DeleteExperienceDTO {
  @ApiProperty({ example: 'happiness', required: true }) experience:
    | string
    | string[];
}

export class DeleteExperienceResponseDTO {
  @ApiResponseProperty() message: string;
  @ApiResponseProperty() deletedCount: number;
}

export class DeleteThemeDTO {
  @ApiProperty({ example: 'Positivity', required: true }) theme:
    | string
    | string[];
}

export class DeleteThemeResponseDTO {
  @ApiResponseProperty() message: string;
  @ApiResponseProperty() deletedCount: number;
}

export class GetThemeDTO {
  @ApiProperty({ example: 'Positivity' }) theme: string | string[];
  @ApiPropertyOptional({ example: 'happiness' }) experience?: string | string[];
  @ApiPropertyOptional({ example: 0, default: 0 }) offset = 0;
  @ApiPropertyOptional({ example: 20, default: 20 }) limit = 20;
}

export class GetThemeResponseDTO {
  @ApiResponseProperty()
  docs: PaginatedTheme[];
  @ApiResponseProperty()
  offset?: number;
  @ApiResponseProperty()
  limit: number;
  @ApiResponseProperty()
  total: number;
}

export class GetExperienceDTO {
  @ApiPropertyOptional({ example: 'happiness' }) experience: string | string[];
  @ApiProperty({ example: 'Positivity' }) theme?: string | string[];
  @ApiPropertyOptional({ example: 0, default: 0 }) offset = 0;
  @ApiPropertyOptional({ example: 20, default: 20 }) limit = 20;
}

export class GetExperienceResponseDTO {
  @ApiResponseProperty()
  docs: Experience[];
  @ApiResponseProperty()
  offset?: number;
  @ApiResponseProperty()
  limit: number;
  @ApiResponseProperty()
  total: number;
}
