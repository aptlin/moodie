import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';

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
