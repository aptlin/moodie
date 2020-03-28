import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'ray@moodie.sdll.io' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @ApiProperty({ example: 'totallysecurepassword' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must have at least 8 characters.' })
  password: string;
}

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
  @ApiPropertyOptional() readonly ipAddress?: string;
}
