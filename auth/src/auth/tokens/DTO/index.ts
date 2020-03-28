import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginResponseDTO {
  @ApiProperty() readonly accessToken: string;
  @ApiProperty({ default: 'bearer' }) readonly tokenType? = 'bearer';
  @ApiProperty() readonly expiresIn: number;
  @ApiPropertyOptional() refreshToken?: string;
}

export class CreateTokenDTO {
  @ApiProperty() readonly value: string;
  @ApiPropertyOptional() readonly userId?: string;
  @ApiProperty() readonly expiresAt: Date;
  @ApiPropertyOptional() readonly clientId?: string;
  @ApiPropertyOptional() readonly ipAddress?: string;
}
