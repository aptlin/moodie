import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';

export class CreateDTO {
  @ApiPropertyOptional({ default: 'Default', example: 'Positivity' })
  theme?: string = 'Default';
  @ApiProperty({ example: 'happiness' }) experience: string | string[];
  @ApiPropertyOptional({ default: true, example: true }) isFavorite? = true;
}

export class CreateResponseDTO {
  @ApiResponseProperty() total: number;
  @ApiResponseProperty() created: number;
  @ApiResponseProperty() updated: number;
}

export class UpdateDTO {
  @ApiProperty({ example: 'happiness' }) experience: string | string[];
  @ApiPropertyOptional({ default: false, example: false }) isFavorite? = false;
}

export class UpdateResponseDTO {
  @ApiResponseProperty() total: number;
  @ApiResponseProperty() updated: number;
}
