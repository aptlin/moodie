import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDTO {
  @IsEmail({}, { message: 'Email is invalid' })
  @ApiProperty({ default: 'test@test.com' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password is too short.' })
  @ApiProperty({ default: 'changemeplease' })
  password: string;

  @ApiPropertyOptional()
  clientId?: string;
}
